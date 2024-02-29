import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPHttpClient} from "@microsoft/sp-http";

const getListItems = async (context: WebPartContext, listUrl: string, listName: string, listDisplayName: string, pageSize: number) =>{
    const responseUrl = `${listUrl}/_api/web/Lists/GetByTitle('${listName}')/items?$top=${pageSize}`;
  
    try{
      const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1);
      if (response.ok){
        const results = await response.json();
        return results.value;
      }else{
        console.log("getListItems: " + listUrl + listName + response.statusText);
        return [];
      }
    }catch(error){
      console.log("getListItems: " + listUrl + listName + error);
    }
};
export const readAllLists = async (context: WebPartContext, listUrl: string, listName: string, pageSize: number) =>{
    const listData: any = [];
    let aggregatedListsPromises : any = [];
    const responseUrl = `${listUrl}/_api/web/Lists/GetByTitle('${listName}')/items`;
  
    try{
      const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1);
      if (response.ok){
        const responseResults = await response.json();
        responseResults.value.map((item: any)=>{
          listData.push({
            listName: item.Title,
            listDisplayName: item.ListDisplayName,
            listUrl: item.ListUrl
          });
        });
        listData.map((listItem: any)=>{
            aggregatedListsPromises = aggregatedListsPromises.concat(getListItems(context, listItem.listUrl, listItem.listName, listItem.listDisplayName, pageSize));
        });
      }else{
        console.log("readAllLists Error: " + listUrl + listName + response.statusText);
        return [];
      }
    }catch(error){
      console.log("readAllLists Error: " + listUrl + listName + error);
    }
  
    return Promise.all(aggregatedListsPromises);
};

export const getGraphMemberOf = async (context: WebPartContext) =>{
    const graphResponse = await context.msGraphClientFactory.getClient('3');
    const graphUrl = '/me/transitiveMemberOf/microsoft.graph.group';
    const memberOfGraph = await graphResponse
        .api(graphUrl)
        .header('ConsistencyLevel', 'eventual')
        .count(true)
        .select('displayName,mail')
        .top(500)
        .get();

    const userGroups = [];
    for (const group of memberOfGraph.value){
        userGroups[group.displayName] = {displayName: group.displayName, email: group.mail};
    }

    return userGroups;
};
export const isFromTargetAudience = (context: WebPartContext, userGroups: any, targetAudience: any, targetAudienceKey: string) => {
    
    for (const audience of targetAudience){
        if (context.pageContext.user.email === audience.email) return true;
        if (userGroups[audience[targetAudienceKey]]) return true;
    }

    return false;
};

const getSiteId = async (context: WebPartContext, siteUrl: string) =>{
    const responseUrl = `${siteUrl}/_api/site/id`;
    const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1).then(r => r.json());
    return response.value;
};
const getListGuid  = async (context: WebPartContext, siteUrl: string, listName: string) => {
    const responseUrl = `${siteUrl}/_api/web/lists/getByTitle('${listName}')/Id`;
    const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1).then(r => r.json());
    return response.value;
};
const getListItemsGraph = async (context: WebPartContext, siteUrl: string, listName: string) => {
    const siteId = await getSiteId(context, siteUrl);
    const listGuid = await getListGuid(context, siteUrl, listName);

    const graphClient = await context.msGraphClientFactory.getClient('3');
    const items = await graphClient.api(`sites/${siteId}/lists/${listGuid}/items?expand=fields(select=Title,link,Image,_ModernAudienceTargetUserField,Author,Id,login,pwd,LoginDisclaimer,NewTab,Category,ID,Created,Modified,Short_x0020_Description)`).get();
    return items.value.map((item: any) => {return {...item, libraryName: listName}});
};
export const readAllListsGraph = async (context: WebPartContext, listUrl: string, listName: string, pageSize: number) =>{
    const listData: any = [];
    let aggregatedListsPromises : any = [];
    const responseUrl = `${listUrl}/_api/web/Lists/GetByTitle('${listName}')/items`;
  
    try{
      const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1);
      if (response.ok){
        const responseResults = await response.json();
        responseResults.value.map((item: any)=>{
          listData.push({
            listName: item.Title,
            listDisplayName: item.ListDisplayName,
            listUrl: item.ListUrl
          });
        });
        listData.map((listItem: any)=>{
            aggregatedListsPromises = aggregatedListsPromises.concat(getListItemsGraph(context, listItem.listUrl, listItem.listName));
        });
      }else{
        console.log("readAllListsGraph Error: " + listUrl + listName + response.statusText);
        return [];
      }
    }catch(error){
      console.log("readAllListsGraph Error: " + listUrl + listName + error);
    }
  
    return Promise.all(aggregatedListsPromises);
};

export const copyTextToClipboard = async (textToCopy: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      }
    } catch (err) {
      console.error(err);
    }
};