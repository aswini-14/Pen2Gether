import React, { useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillCursors from 'quill-cursors'; // Cursor module
import { useSupplier } from '../../context/supplierContext'; // Custom context

Quill.register('modules/cursors', QuillCursors);

const Editor = () => {
  const { darkMode, setQuill } = useSupplier();

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return;

    // Clear previous content
    while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);

    // Create editor container
    const editor = document.createElement('div');
    editor.style.minHeight = '30em';
    editor.style.maxHeight = '80em';
    editor.style.borderRadius = '10px';

    // Dark/light mode styling
    if (darkMode) {
      editor.classList.add('bg-dark', 'text-white');
      editor.style.color = 'white';
    } else {
      editor.classList.add('bg-light', 'text-black');
      editor.style.color = 'black';
    }

    wrapper.append(editor);

    // Initialize Quill with cursor and custom image handler
    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        cursors: true,
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ],
          handlers: {
            image: function () {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.click();

              input.onchange = () => {
                const file = input.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const range = this.quill.getSelection();
                    this.quill.insertEmbed(range.index, 'image', reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              };
            }
          }
        }
      }
    });

    q.setText('');

    setQuill(q);
  }, [darkMode, setQuill]);

  return <div className="container my-4" ref={wrapperRef}></div>;
};

export default Editor;
