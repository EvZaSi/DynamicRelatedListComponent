import { LightningElement,api } from 'lwc';

export default class RelatedListCustomFieldSelectionModal extends LightningElement {
    @api fieldListClone;
    @api selectedMetaFieldName;
    @api selectedFieldName;
    selectedField;

    handleComboChange(event){
        this.selectedField = event.target.value;
    }

    submitDetails(){
        this.dispatchEvent(new CustomEvent('selectedfield', { detail: this.selectedField}));
    }

    closeModal(){
        this.dispatchEvent(new CustomEvent('closecombomodal'));
    }

}