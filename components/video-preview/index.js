window.customElements.define('video-preview',
  class VideoPreview extends HTMLElement{
    constructor(){
      super();
    }

    connectedCallback(){
      const shadowRoot = this.attachShadow({mode: 'open'});
      shadowRoot.appendChild(this.style);
      shadowRoot.appendChild(this.content);

      this.mediaSource = new MediaSource();
      this.mediaSource.addEventListener('sourceopen', (event) => this.sourceOpenHandler(event));
      this.sourceBuffer = undefined;

      const constraints = {
        audio: true,
        video: true
      };
        
      navigator.mediaDevices.getUserMedia(constraints)
        .then( (stream) => {
          window.stream = stream;
          this.shadowRoot.querySelector('video#preview').srcObject = stream;
        })
        .catch( (error) => {
          console.error(`navigator.getUserMedia error: ${error}`);
        });
    }

    get style(){
      let style = document.createElement('style');
      style.innerHTML = `
      video{
        width: 33vw;
        border: 1px black solid;
      }
      `;
      return style;
    }

    get content(){
      let content = document.createElement('video');
      content.id = 'preview';
      content.setAttribute('autoplay', '');
      content.muted = true;
      content.setAttribute('playsinline', '');

      return content;
    }

    sourceOpenHandler(event){
      this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');        
    }

  }
);
