import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';

export default class RelatedListCustomRecordDeleteModal extends LightningElement {
    @api objectName;
    @api recordId;

    confirmDelete(){
        deleteRecord(this.recordId).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record deleted',
                    variant: 'success'
                })
            );
            this.closeModal();
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
            this.closeModal();
        });
    }

    closeModal(){
        this.dispatchEvent(new CustomEvent('closedeletemodal'));
    }
}