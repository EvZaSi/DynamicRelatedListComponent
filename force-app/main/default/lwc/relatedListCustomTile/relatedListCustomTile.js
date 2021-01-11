import { LightningElement,api,track } from 'lwc';

export default class RelatedListCustomTile extends LightningElement {
    @api recordObj;

    @track actions = [
        {label: 'Edit', value: 'edit', iconName: 'utility:edit'},
        {label: 'Delete', value: 'delete', iconName: 'utility:delete'},
    ];


    handleAction(event){
        const tileAction = event.detail.action.value;
        if(tileAction == 'edit'){
            this.sendEditEvent();
        }
        if(tileAction == 'delete'){
            this.sendDeleteEvent();
        }
    }

    sendEditEvent(){
        this.dispatchEvent(new CustomEvent('tileedit', { detail: this.recordObj.id}));
    }

    sendDeleteEvent(){
        this.dispatchEvent(new CustomEvent('tiledelete', { detail: this.recordObj.id}));
    }
}