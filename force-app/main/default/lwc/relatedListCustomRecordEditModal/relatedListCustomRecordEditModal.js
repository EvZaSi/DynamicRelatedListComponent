import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class RelatedListCustomRecordEditModal extends LightningElement {
    @api objectName;
    @api existingRecordId = null;
    @api editOrNew;

    closeRecordEditModal(){
        this.dispatchEvent(new CustomEvent('closerecordeditmodal'));
    }

    get modalHeader(){
        console.log(this.editOrNew);
        if(this.editOrNew == 'edit'){
            return "Edit Record";
        }
        if(this.editOrNew == 'new'){
            return "New Record";
        }
    }

    handleSuccess(event){
        this.closeRecordEditModal();
        let title;
        if(this.editOrNew == 'edit'){
            this.title = "Record edited successfully"
        }
        if(this.editOrNew == 'new'){
            this.title = "Record created successfully"
        }
        const evt = new ShowToastEvent({
            title: this.title,
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }

}