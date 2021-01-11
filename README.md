# Dynamic RelatedList Lightning Web Component

Being able to select which fields are currently displaying within a component is something that users occasionally request, and while it presents security risk for viewing fields not able to be seen by the current users (and information overload), there are steps that can be taken to ensure fields not visible to the user aren't accessible even within a dynamic field selection process. This can be done with an .isAccessible() call within Apex.

That being said - for the initial commit my focus has not been on field level security. This is more of a proof of concept and to have the front-end aspect configured and ready to go for when the Apex classes are altered to fully meet security needs.

The component list for this project are as follows:

-RelatedListCustom
-RelatedListCustomTile
-RelatedListCustomFieldSelectionModal
-RelatedListCustomRecordEditModal
-RelatedListCustomRecordDeleteModal

Each of the components below RelatedListCustom are nested within the RelatedListCustom component. The RelatedListCustom component operates like so:

-Upon adding the RelatedListCustom component to a Lightning Record Page, you must provide two fields - the objectName of the sObject you'd like this Related List to display, and the parentFieldAPIName. This provides the context of the lookup value on the sObject you're displaying in the component and links it to the sObject that the component sits on. 

-After viewing the Lightning Record Page that the component sits on, the ConnectedCallback of the RelatedListCustom component calls out an Apex controller that provides all fields for the related sObject using dynamic Apex. It secondarily queries the sObject records of the specified type related to the sObject that the Lighting Record Page is on, and stores those in the RelatedListCustom component.

-The RelatedListCustom component uses the RelatedListCustomTile component to display each of the returned records of the specified sObject type. The RelatedListCustomTile component contains action methods given by a lightning-button-menu object in the top right that allows you to Edit or Delete the record. The edit action is done by enabling the RelatedListCustomRecordEditModal, which uses the lightning-record-form component. The delete action is done by enabling the RelatedListCustomRecordDeleteModal which uses the uiRecordApi for deletion itself.

-Finally, each RelatedListTile contains three fields aside from the Name field of the sObject. These are the fields that can be dynamically altered using the queried field metadata from the connected Apex class called in the ConnectedCallback. The RelatedListCustomFieldSelectionModal displays every availble value, aside from the other currently chosen fields used in the the RelatedListCustomTile. Selection of a field and submission of that new selection results in the RelatedListCustom component to requery the data using the newly chosen field values, and updating those records within each of the RelatedListCustomTile components.
