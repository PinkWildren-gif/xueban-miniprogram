// components/compliance-modal/compliance-modal.js
// Full-screen compliance gate shown until the user acknowledges the
// "double reduction" (双减) policy notice. Parent page controls `show`
// and listens for the `agree` event to persist acknowledgement.
Component({
  options: {
    // Let global classes from app.wxss (.serif, .btn-primary, ...) apply inside this component
    styleIsolation: 'apply-shared'
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onAgree() {
      this.triggerEvent('agree');
    },

    goTerms() {
      wx.navigateTo({ url: '/pages/terms/terms' });
    },

    goPrivacy() {
      wx.navigateTo({ url: '/pages/privacy/privacy' });
    },

    // Swallow touches on the mask / block background scroll
    noop() {}
  }
});
