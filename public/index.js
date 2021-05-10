(function () {
   const toolbar = document.getElementById('toolbar');
   let editor = document.getElementById('editor');
   editor.contentDocument.designMode = "on";
   const bold = document.querySelector('.bold');
   const italic = document.querySelector('.italic');
   const list = document.querySelector('.list');
   const form = document.getElementById('uploadForm');
   const expBtn = document.getElementById('file__export');

   const uploadFile = async (e) => {
      e.preventDefault();
      let fileList = document.getElementById('file__select').files[0];
      const text = await fileList.text();
      const values = Object.values(JSON.parse(text));
      editor.contentDocument.getElementsByTagName('body')[0].innerHTML = `${values.map(el => el)}`;
   }

   const exportFile = (data) => {
      fetch('/upload-text', {
         method: "post",
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      });

      const download = async () => {
         const response = await fetch('/download-file');
         const file = await response.blob();

         const url = URL.createObjectURL(file);
         const link = document.createElement('a');

         link.href = url;
         link.download = 'download';

         const handleClick = function () {
            setTimeout(() => {
               URL.revokeObjectURL(url);

               this.removeEventListener('click', handleClick);

               (this.remove && (this.remove(), 1)) ||
                  (this.parentNode && this.parentNode.removeChild(this));
            }, 150);
         };
         link.addEventListener('click', handleClick, false);
         link.click();

      }
      download();

   };

   this.format = function (cmd) { editor.contentDocument.execCommand(cmd, !1, null) }
   this.formatParam = function (cmd, param) { editor.contentDocument.execCommand(cmd, !1, param) }
   this.print = function () { let code = getHtml(); let newWindow = window.open(); newWindow.document.write(editor.contentDocument.getElementsByTagName('body')[0].innerHTML); newWindow.print(); newWindow.close() }
   this.getHtml = function () { let code = editor.contentDocument.getElementsByTagName('body')[0].innerHTML; return code }

   bold.addEventListener('click', (e => {
      e.preventDefault();
      format('bold');
   }));
   italic.addEventListener('click', (e => {
      e.preventDefault();
      format('italic');
   }));
   list.addEventListener('click', (e => {
      e.preventDefault();
      format('insertUnorderedList');
   }));

   form.addEventListener('submit', uploadFile);
   expBtn.addEventListener('click', (e => {
      text = editor.contentDocument.getElementsByTagName('body')[0].innerHTML;
      exportFile(text);
   }));
})();