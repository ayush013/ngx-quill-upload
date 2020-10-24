export default {
  ID_SPLIT_FLAG: '__ID_SPLIT__',
  QUILL_UPLOAD_HOLDER_CLASS_NAME: 'quill-upload-progress',
  DEFAULT_STYLES: `
    .quill-progress-wrapper {
      height: 0.25rem;
      position: relative;
      background: #f3efe6;
      overflow: hidden;
      margin-top: 0;
    }

    .quill-progress-wrapper span {
      display: block;
      height: 100%;
    }

    .quill-progress {
      background-color: #3498db;
      animation: progressBar 10s ease-in-out;
      animation-fill-mode:both;
    }

    @keyframes progressBar {
      0% { width: 0; }
      100% { width: 100%; }
    }

    .d-none {
      display: none;
    }

    .quill-upload-progress {
      opacity: 0.3;
    }
  `,
  blots: {
    video: 'video',
    image: 'image',
  },
  LOADING_CLASS_NAME: 'quill-progress-wrapper',
  NONE_DISPLAY_CLASS_NAME: 'd-none',
};
