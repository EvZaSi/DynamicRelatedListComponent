public class RelatedListController {
    
    public class sObjectWrapperRelatedList {
        @auraEnabled
        public String Id;
        @auraEnabled
        public String Name;
        @auraEnabled
        public List<Map<String,Object>> fieldMap;
        @AuraEnabled
        public Integer listLength;

        public sObjectWrapperRelatedList(Id insertId,String insertName){
            this.Id = String.valueOf(insertId);
            this.Name = insertName;
            this.fieldMap = new List<Map<String,Object>>();
        }
    }


    public class sObjectFieldComboboxWrapper {
        @AuraEnabled
        public String pluralObjName;
        @AuraEnabled
        public string nameField;
        @AuraEnabled
        public List<Map<String,String>> otherFieldList;

        public sObjectFieldComboboxWrapper(){
            this.otherFieldList = new List<Map<String,String>>();
        }
    }
    
  
    @AuraEnabled( cacheable=true )  
    public static List<sObjectWrapperRelatedList> fetchRecords( String listValues )  {  
        List < String > strList = listValues.split( ',' );  
        Integer recordListLength;
          
        if ( strList.size() == 7 ) {  
          
            String recordId = strList.get( 0 );  
            String objectName = strList.get( 1 );  
            String parentFieldAPIName = strList.get( 2 );
            String nameField = strList.get( 3 );  
            String displayField1 = strList.get( 4 );  
            String displayField2 = strList.get( 5 );  
            String displayField3 = strList.get( 6 );
            
            List<String> fieldList = new List<String>{displayField1,displayField2,displayField3};
              
            String strSOQL = 'SELECT Id,' + nameField + ',' + displayField1 + ',' + displayField2 + ',' + displayField3 
            + ' FROM ' + objectName + ' WHERE ' + parentFieldAPIName + ' = \'' + recordId + '\'';
            List<sObject> returnList =  Database.query( strSOQL );
            recordListLength = returnList.size();
            Map<String, Schema.SObjectType> globalSobjects = Schema.getGlobalDescribe() ;
            Schema.SObjectType sobjectToken = globalSobjects.get(objectName);
            Schema.DescribeSObjectResult sobjectResult = sobjectToken.getDescribe();


            List<sObjectWrapperRelatedList> objectList = new List<sObjectWrapperRelatedList>();
            
            Integer iterationLength;
            if(recordListLength > 6){
                iterationLength = 6;
            }else{
                iterationLength = recordListLength;
            }

            for(Integer i=0;i<iterationLength; i++) {
                sObjectWrapperRelatedList sobjWrapper = new sObjectWrapperRelatedList(returnList[i].Id,String.valueOf(returnList[i].get('Name')));
                List<Map<String, Object>> sobjectFieldMaps = new List<Map<String, Object>>();
                for(String fieldString : fieldList){
                    Map<String,Object> labelValueMap = new Map<String,Object>();
                    labelValueMap.put('label',fieldString);
                    if(returnList[i].get(fieldString) == null){
                        labelValueMap.put('value',null);
                    }else{
                        labelValueMap.put('value',returnList[i].get(fieldString));
                    }
                    sobjectFieldMaps.add(labelValueMap);

                }
                sobjWrapper.listLength = recordListLength;
                sobjWrapper.fieldMap = sobjectFieldMaps;
                objectList.add(sobjWrapper);
            }
            return objectList;  
              
        } else   
            return null;  
          
    }

    @AuraEnabled( cacheable=true )  
    public static sObjectFieldComboboxWrapper getFields( String sobjectAPIName )  {

        List < Map < String, String >> options = new List < Map < String, String >> ();
        Map<String, Schema.SObjectType> globalSobjects = Schema.getGlobalDescribe() ;
        Schema.SObjectType sobjectToken = globalSobjects.get(sobjectAPIName);
        Schema.DescribeSObjectResult sobjectResult = sobjectToken.getDescribe() ;
        Map<String,Schema.SObjectField> fields = new Map<String,Schema.SObjectField>(sobjectResult.fields.getMap());

        sObjectFieldComboboxWrapper comboBoxWrap = new sObjectFieldComboboxWrapper();
        comboBoxWrap.pluralObjName = sobjectResult.getLabelPlural();

        Boolean sobjectNameFieldPresent = false;
        if(fields.get('Name') != null){
            comboBoxWrap.nameField = 'Name';
            sobjectNameFieldPresent = true;
            fields.remove('Name');
        }
        for(String fieldName : fields.keySet()){
            if(sobjectNameFieldPresent == false && fields.get(fieldName).getDescribe().isNameField() == true){
                comboBoxWrap.nameField = fieldName;
                sobjectNameFieldPresent = true;
                fields.remove(fieldName);
            }
            Map < String, String > values = new Map < String, String > {
                'label' => String.valueOf(fields.get(fieldName)),
                'value' => String.valueOf(fields.get(fieldName))
            };
            comboBoxWrap.otherFieldList.add(values);
        }
        return comboBoxWrap;

    }
   
}  