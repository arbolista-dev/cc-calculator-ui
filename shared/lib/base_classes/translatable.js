import ContextableComponent from './contextable';

export default class TranslatableComponent extends ContextableComponent {

  get t() {
    const i18n = this.context.i18n;
    if (!i18n) {
      // i18n not present - probably unit test
      return key =>
        // no translation - used for checking the keys
         key;
    }
    // TODO: implement language switching
    return i18n.getFixedT(i18n.language, 'translations');
  }

  get i18next() {
    return this.context.i18n;
  }
}

TranslatableComponent.NAME = 'Translatable';
