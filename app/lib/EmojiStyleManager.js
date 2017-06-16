import crc32 from 'buffer-crc32';
import detectEmojiScale from 'mojibaka/detect/scale';

const LOCALSTORAGE_KEY = 'EmojiStyleManager';
const SMALL_EMOJI_CLASSNAME = 'tiny-kitemoji';

class EmojiStyleManager {
  scale = null;
  userAgentHash = crc32.unsigned(navigator.userAgent).toString(16);

  constructor() {
    // Let's see if we have a stored scale which matches this user agent!
    const lastScale = localStorage.getItem(LOCALSTORAGE_KEY);
    if (lastScale) {
      const parsedScale = JSON.parse(lastScale);
      if (parsedScale && parsedScale.userAgentHash === this.userAgentHash) {
        // Nice! Let's take it, and not churn the DOM!
        this.scale = parsedScale.scale;
      }
    }
  }

  toJson() {
    return JSON.stringify({
      userAgentHash: this.userAgentHash,
      scale: this.scale
    });
  }

  calculate() {
    this.scale = detectEmojiScale();

    // Store the scale so we don't have to churn the DOM next time!
    localStorage.setItem(LOCALSTORAGE_KEY, this.toJson()); // eslint-disable-line id-length
  }

  apply() {
    if (!this.scale) {
      // We didn't have a valid, saved scale. Let's see what it should be!
      this.calculate();
    }

    // If the scale is >= 1.2, we consider it "normal", as most
    // browsers fall between 1.3 and 1.4 times
    const isTiny = this.scale < 1.2;

    // Set the body className as necessary!
    document.documentElement.classList[isTiny ? 'add' : 'remove'](SMALL_EMOJI_CLASSNAME);
  }
}

export default new EmojiStyleManager();
