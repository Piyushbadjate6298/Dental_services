export const STORE = 'shital-dental-v1';

export const defaultData = {
  doctors: [],
  whatsapp: '919423105611',
  labName: 'Shital Dental Services',
  labAddress: 'Lasalgaon 422306, Tal. Niphad, Nashik',
  labPhone: '9370045066',
  nextNo: 301,
  inquiries: [],
};

export const instructions = [
  'White Metal',
  'Ceramic',
  'Zircon',
  'Valplast',
  'R.P.D.C.',
  'Half Ceramic',
  'Japanese Gold',
];

export const stages = ['Metal Trial', 'Bisque Trial', 'Final'];

export const teeth = [8, 7, 6, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 6, 7, 8];

export const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const today = () => new Date().toISOString().slice(0, 10);

export const readData = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORE) || '{}');
    const merged = { ...defaultData, ...stored };
    if (!String(merged.whatsapp || '').trim()) {
      merged.whatsapp = defaultData.whatsapp;
    }
    return merged;
  } catch {
    return { ...defaultData };
  }
};

export function toothNames(keys = []) {
  return keys.map((k) => {
    const [j, i] = k.split('-');
    return `${j === 'U' ? 'Upper' : 'Lower'} ${teeth[Number(i)]}`;
  });
}

export function cleanPhone(s) {
  let digits = (s || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

export function makeMessage(x, d) {
  return `${d.labName || 'Shital Dental Services'}
DENTAL LAB INQUIRY #${x.number}
Date: ${x.date}
Doctor: ${x.doctor}
Patient: ${x.patient}
Tooth numbers: ${toothNames(x.teeth).join(', ') || 'Not selected'}
Tooth shade: ${x.shade || '—'}
Instructions: ${(x.instructions || []).join(', ') || '—'}
Work stage: ${(x.stages || []).join(', ') || '—'}
${x.note ? 'Additional instructions: ' + x.note + '\n' : ''}Bill details:
${(x.items || []).map((i) => `${i.description}: ${money(i.amount)}`).join('\n')}
TOTAL: ${money(x.total)}`;
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function wrapLines(ctx, text, maxWidth) {
  const str = String(text || '—');
  const words = str.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      if (ctx.measureText(word).width <= maxWidth) {
        current = word;
      } else {
        let chunk = '';
        for (const ch of word) {
          if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        current = chunk;
      }
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : ['—'];
}

export function makeBillBlob(x, d) {
  return new Promise((resolve) => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const W = 1000;

    // Pre-calculate wrapped lines so nothing clips on long tooth lists or many bill items.
    ctx.font = 'bold 22px Arial';
    const detailRows = [
      ['Doctor', x.doctor],
      ['Patient', x.patient],
      ['Tooth shade', x.shade || '—'],
      ['Teeth', toothNames(x.teeth).join(', ') || 'Not selected'],
      ['Instructions', (x.instructions || []).join(', ') || '—'],
      ['Work stage', (x.stages || []).join(', ') || '—'],
      ...(x.note ? [['Additional note', x.note]] : []),
    ].map(([label, val]) => ({
      label,
      lines: wrapLines(ctx, val, 600),
    }));

    const detailHeight = detailRows.reduce(
      (sum, row) => sum + 28 + row.lines.length * 30,
      0
    );
    const itemsHeight = (x.items || []).length * 52;
    const neededHeight = 385 + detailHeight + 70 + itemsHeight + 210;
    const H = Math.max(1420, neededHeight);

    c.width = W;
    c.height = H;

    ctx.fillStyle = '#f4f7f5';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(48, 48, 904, H - 96);
    ctx.strokeStyle = '#d9e3dc';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 904, H - 96);

    ctx.fillStyle = '#12363b';
    ctx.fillRect(48, 48, 904, 205);
    ctx.fillStyle = '#d7e7d8';
    ctx.beginPath();
    ctx.arc(130, 125, 43, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#12363b';
    ctx.font = 'bold 43px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✦', 130, 141);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Arial';
    ctx.fillText(d.labName || 'Shital Dental Services', 200, 117);
    ctx.fillStyle = '#c9dcd4';
    ctx.font = '19px Arial';
    ctx.fillText('DENTAL LABORATORY INQUIRY', 202, 153);
    ctx.font = '17px Arial';
    ctx.fillText(d.labAddress || '', 202, 188);

    ctx.fillStyle = '#19383b';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`INQUIRY  #${x.number}`, 90, 303);
    ctx.font = '19px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Date: ${x.date}`, 910, 303);
    ctx.textAlign = 'left';

    ctx.strokeStyle = '#dce5df';
    ctx.beginPath();
    ctx.moveTo(90, 330);
    ctx.lineTo(910, 330);
    ctx.stroke();

    let y = 382;
    detailRows.forEach(({ label, lines }) => {
      ctx.fillStyle = '#71817b';
      ctx.font = '17px Arial';
      ctx.fillText(label.toUpperCase(), 90, y);
      ctx.fillStyle = '#19383b';
      ctx.font = 'bold 22px Arial';
      lines.forEach((lineText, idx) => {
        ctx.fillText(lineText, 300, y + idx * 30);
      });
      y += 28 + lines.length * 30;
    });

    y += 10;
    ctx.fillStyle = '#eaf0eb';
    ctx.fillRect(90, y, 820, 48);
    ctx.fillStyle = '#19383b';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('DESCRIPTION', 112, y + 31);
    ctx.textAlign = 'right';
    ctx.fillText('AMOUNT', 885, y + 31);
    ctx.textAlign = 'left';
    y += 48;

    (x.items || []).forEach((it) => {
      ctx.strokeStyle = '#e5ebe6';
      ctx.beginPath();
      ctx.moveTo(90, y + 51);
      ctx.lineTo(910, y + 51);
      ctx.stroke();
      ctx.font = '19px Arial';
      ctx.fillStyle = '#334c48';
      ctx.fillText((it.description || '—').slice(0, 52), 112, y + 32);
      ctx.textAlign = 'right';
      ctx.fillText(money(it.amount), 885, y + 32);
      ctx.textAlign = 'left';
      y += 52;
    });

    y += 20;
    ctx.fillStyle = '#12363b';
    ctx.fillRect(90, y, 820, 76);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 23px Arial';
    ctx.fillText('TOTAL', 120, y + 48);
    ctx.textAlign = 'right';
    ctx.font = 'bold 30px Arial';
    ctx.fillText(money(x.total), 880, y + 50);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#7b8c82';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Thank you  •  Shital Dental Services', 500, H - 115);
    ctx.fillText(`Contact: ${d.labPhone || '—'}`, 500, H - 82);
    ctx.textAlign = 'left';

    c.toBlob((b) => resolve(b), 'image/png');
  });
}

export async function shareInquiryOnWhatsApp(item, data) {
  const phone = cleanPhone(data.whatsapp);
  const canFileShare = !!(
    navigator.share &&
    navigator.canShare?.({
      files: [new File(['x'], 'share-test.txt', { type: 'text/plain' })],
    })
  );
  const fallbackTab = canFileShare ? null : window.open('about:blank', '_blank');

  try {
    const blob = await makeBillBlob(item, data);
    const file = new File([blob], `Shital-Dental-${item.number}.png`, {
      type: 'image/png',
    });
    const text = makeMessage(item, data);

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      if (fallbackTab && !fallbackTab.closed) fallbackTab.close();
      await navigator.share({
        title: `Dental inquiry #${item.number}`,
        text,
        files: [file],
      });
      return 'shared';
    }

    downloadBlob(blob, `Shital-Dental-${item.number}.png`);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (fallbackTab && !fallbackTab.closed) {
      fallbackTab.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return 'fallback';
  } catch (e) {
    if (fallbackTab && !fallbackTab.closed) fallbackTab.close();
    throw e;
  }
}
