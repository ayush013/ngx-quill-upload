import Constants from '../Constants';

export default class Helper {
  id = 0;
  prefix = 'QUILL_UPLOAD_HANDLER';
  generateID(): string {
    const id = this.id;
    this.id = id + 1;
    return `${this.prefix}-${id}`;
  }
  loadingHTML(): string {
    return `<div id="${Constants.ID_SPLIT_FLAG}.QUILL-LOADING">
                        <span style="width:90%;"><span class="quill-progress">
                        </span></span>
                      </div>`;
  }
}

