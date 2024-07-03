import videojs from 'video.js';

// Extend the Html5 tech
class OctetStreamHandler extends videojs.getTech('Html5') {
  constructor(player, options, ready) {
    super(player, options, ready);
  }

  setSrc(source) {
    if (source) {
      this.el_.src = source;
    }
  }

  currentSrc() {
    return this.el_.src;
  }
}

// Register the custom tech
videojs.registerTech('OctetStreamHandler', OctetStreamHandler);

// Register a source handler to the Html5 tech
videojs.getTech('Html5').registerSourceHandler({
  canHandleSource: (source) => {
    // Check if the source type is 'application/octet-stream'
    if (source.type === 'application/octet-stream') {
      return 'probably';
    }
    return '';
  },

  handleSource: (source, tech) => {
    tech.setSrc(source.src);
  }
}, 0);

export default OctetStreamHandler;
