import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmphasisEditor } from './EmphasisEditor';
import { EmphasisCapableContent } from '../../types/reportWorkspace';

const setSelectionRange = (container: HTMLElement, start: number, end: number) => {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let currentOffset = 0;
  let startNode: Node | null = null;
  let endNode: Node | null = null;
  let startOffset = 0;
  let endOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const textLength = node.textContent?.length ?? 0;
    const nextOffset = currentOffset + textLength;

    if (!startNode && start <= nextOffset) {
      startNode = node;
      startOffset = Math.max(0, start - currentOffset);
    }

    if (!endNode && end <= nextOffset) {
      endNode = node;
      endOffset = Math.max(0, end - currentOffset);
      break;
    }

    currentOffset = nextOffset;
  }

  if (!startNode || !endNode) {
    throw new Error('Unable to create selection range');
  }

  const selection = window.getSelection();
  if (!selection) {
    throw new Error('Selection API is unavailable');
  }

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  selection.removeAllRanges();
  selection.addRange(range);
};

describe('EmphasisEditor', () => {
  it('applies bold style to selected text', () => {
    const handleChange = vi.fn();

    render(
      <EmphasisEditor
        label="測試欄位"
        value={[{ text: 'Alpha Beta' }]}
        onChange={handleChange}
      />
    );

    const editor = screen.getByRole('textbox', { name: '測試欄位' });
    setSelectionRange(editor, 6, 10);

    fireEvent.click(screen.getByRole('button', { name: '粗體' }));

    expect(handleChange).toHaveBeenCalled();
    const latestValue = handleChange.mock.calls.at(-1)?.[0];
    expect(latestValue).toEqual([
      { text: 'Alpha ' },
      { text: 'Beta', emphasis: { bold: true } },
    ]);
  });

  it('applies selected color to highlighted text', () => {
    const handleChange = vi.fn();

    render(
      <EmphasisEditor
        label="測試欄位"
        value={[{ text: 'Gamma Delta' }]}
        onChange={handleChange}
      />
    );

    const editor = screen.getByRole('textbox', { name: '測試欄位' });
    setSelectionRange(editor, 6, 11);
    fireEvent.mouseUp(editor);

    fireEvent.mouseDown(screen.getByLabelText('文字顏色'));
    fireEvent.click(screen.getByRole('option', { name: '紅色' }));

    expect(handleChange).toHaveBeenCalled();
    const latestValue = handleChange.mock.calls.at(-1)?.[0];
    expect(latestValue).toEqual([
      { text: 'Gamma ' },
      { text: 'Delta', emphasis: { color: 'error' } },
    ]);
  });

  it('strips rich formatting on paste and preserves plain newlines', () => {
    const ControlledEditor = () => {
      const [value, setValue] = useState<EmphasisCapableContent>([{ text: '起始' }]);
      return <EmphasisEditor label="測試欄位" value={value} onChange={setValue} />;
    };

    render(<ControlledEditor />);

    const editor = screen.getByRole('textbox', { name: '測試欄位' });
    const existingLength = editor.textContent?.length ?? 0;
    setSelectionRange(editor, existingLength, existingLength);

    fireEvent.paste(editor, {
      clipboardData: {
        getData: (type: string) => {
          if (type === 'text/plain') {
            return 'A\nB';
          }
          if (type === 'text/html') {
            return '<b>A</b><div>B</div>';
          }
          return '';
        },
      },
    });

    expect(editor.textContent).toBe('起始A\nB');
  });
});
