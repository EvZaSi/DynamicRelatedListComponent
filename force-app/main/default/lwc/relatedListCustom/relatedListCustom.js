import { LightningElement, api } from 'lwc';  
import fetchRecords from '@salesforce/apex/RelatedListController.fetchRecords';
import getFields from '@salesforce/apex/RelatedListController.getFields';


export default class RelatedListCustom extends LightningElement {
    @api recordId;
    @api objectName;   
    @api parentFieldAPIName;
    @api fieldList;
    @api records;
    @api isModalOpen = false;
    @api isEditModalOpen = false;
    @api isDeleteModalOpen = false;
    @api existingRecordId = null;
    @api selectedMetaField;
    @api selectedMetaFieldName;
    @api listLength;
    @api editOrNew;
    @api relatedListFieldObject = { field1 : undefined,
                               field2 : undefined,
                               field3 : undefined};

    get querystring(){
        if(this.relatedListFieldObject.field1 == null || this.relatedListFieldObject.field2 == null || 
            this.relatedListFieldObject.field3 == null){
            this.relatedListFieldObject.field1 = this.fieldList.otherFieldList[2].value;
            this.relatedListFieldObject.field2 = this.fieldList.otherFieldList[3].value;
            this.relatedListFieldObject.field3 = this.fieldList.otherFieldList[4].value;
        }
        //Creating of dyanamic SOQL query string based on selected metadata fields
        return this.recordId + ',' + this.objectName + ',' + this.parentFieldAPIName + ',' + this.fieldList.nameField + ',' + this.relatedListFieldObject.field1 + ',' +
        this.relatedListFieldObject.field2 + ',' + this.relatedListFieldObject.field3;
    }

    get selectedMetaFieldName(){
        //Used to represent the currently selected meta metadata field from gear icon
        switch(this.selectedMetaField){
            case 'field1':
                return 'Field 1';
            case 'field2':
                return 'Field 2';
            case 'field3':
                return 'Field 3';
        }
    }

    get pluralsObjectName(){
        //Creates plural sObject representation with record count
        if(this.fieldList == null || this.fieldList == undefined || this.listLength == null || this.listLength == undefined){
            return '';
        }else{
            return this.fieldList.pluralObjName + ' (' + this.listLength + ')';
        }
    }

    get selectedFieldName(){
        //Pulls actual field name from list field object  Field1 --> Email for example
        return this.relatedListFieldObject[this.selectedMetaField];
    }

    get viewAllHref(){
        //Creates string used for href for the 'View All' link at the bottomn of the component
        if(this.fieldList == null || this.fieldList == undefined){
            return '';
        }else{
            console.log('href');
            return '\/lightning\/r\/'+  this.objectName + '\/' + this.recordId +'\/related\/' + this.fieldList.pluralObjName + '\/view';
        }
    }

    get fieldListClone(){
        //Creates a cloned version of fieldList object without the other selected fields from other meta metadata fields
        this.cloneList = [];
        for(let k=0;k < this.fieldList.otherFieldList.length;k++){
            if(this.fieldList.otherFieldList[k].value == this.relatedListFieldObject[this.selectedMetaField]){
                this.cloneList.push(this.fieldList.otherFieldList[k]);
            }
            else if(this.fieldList.otherFieldList[k].value != 'Id' && this.fieldList.otherFieldList[k].value !=  'Name'){
                this.presentInObject = false;
                this.keys = Object.keys(this.relatedListFieldObject);
                for(let i = 0; i < this.keys.length; i++){
                    if(this.relatedListFieldObject[this.keys[i]] != this.relatedListFieldObject[this.selectedMetaField] && this.fieldList.otherFieldList[k].value == this.relatedListFieldObject[this.keys[i]]){
                        this.presentInObject = true; 
                    }
                }
                if(this.presentInObject == false){
                    this.cloneList.push(this.fieldList.otherFieldList[k]);
                }
            }
        }
        return this.cloneList;
    }

    connectedCallback(){
        this.gatherFields();

    }

    gatherFields(){
        getFields({ sobjectAPIName: this.objectName}).then((result) => {
            console.log('Field gathering success');
            console.log(result);
            this.fieldList = result;
            this.gatherRecords();
        })
        .catch((error) => {
            console.log('Field gathering error');
            console.log(error);
        });
        
        
    }
    gatherRecords(){
        console.log('fetching records');
        console.log(this.querystring);
        fetchRecords({ listValues: this.querystring }).then((result) => {
            console.log('Success gathering records');
            console.log(result);
            this.listLength = result[0].listLength;
            this.records = [];
            //Creates object representing record for containing name, id, record link, and fields list 
            for(var i = 0; i<result.length; i++){
                let individualrec = { name : result[i].Name , 
                                        id : result[i].Id,
                                        href : `/${result[i].Id}`,
                                        fields: result[i].fieldMap}
                this.records.push(individualrec);
            }
        })
        .catch((error) => {
            console.log('Record gathering error');
            console.log(error);
        });
    }
    openModal(event) {
        //Opens comboBox modal
        this.isModalOpen = true;
        this.selectedMetaField = event.target.value;
    }

    handleComboBoxChangeEvent(event){
        //Responds to combobox value selection changing
        this.selectedField = event.detail;
        this.relatedListFieldObject[this.selectedMetaField] = this.selectedField;
        this.gatherRecords();
        this.isModalOpen = false;
    }

    handleComboBoxCloseEvent(){
        //Closes combobox based on event
        this.isModalOpen = false;
    }

    handleNewButtonClick(){
        //Opens relatedListCustomRecordEditModal with the context of creating new record
        this.editOrNew = 'new';
        this.isEditModalOpen = true;
    }

    closeRecordEditModal(){
        //Closes relatedListCustomRecordEditModal
        this.isEditModalOpen = false;
    }

    onTileEditEvent(event){
        //Opens relatedListCustomRecordEditModal with the context of editing existing record
        console.log('editevent');
        this.editOrNew = 'edit';
        this.existingRecordId = event.detail;
        this.isEditModalOpen = true;
    }

    onTileDeleteEvent(event){
        //Opens relatedListCustomRecordDeleteModal with the context of deleting existing record
        this.existingRecordId = event.detail;
        this.isDeleteModalOpen = true;
    }

    closeRecordEditModalEvent(){
        //Closes relatedListCustomRecordEditModal
        this.isEditModalOpen = false;
        this.existingRecordId = null;
        this.editOrNew = null;
    }

    closeRecordDeleteModalEvent(){
        //Closes relatedListCustomRecordDeleteModal
        this.gatherRecords();
        this.isDeleteModalOpen = false;
        this.existingRecordId = null;
    }

}
