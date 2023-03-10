import React, {useContext, createContext, useState, useEffect} from 'react'

import Cookies from 'js-cookie';

export const Context = createContext({});
const ProviderComponent  = (props)=>{

    const [contextData, setContextData] = useState({customerId:''})

    const contextId = props?.contextId;
    const useCookies = props?.useCookies;
    console.log('mfe contextId in order mfe' , contextId);
    console.log('mfe useCookies' , useCookies);
    
    useEffect(() => {
        console.log('useEffect log 1');
       
        if (contextId && !useCookies) {
            console.log('fetching context information', contextId);
            fetch('https://localhost:8443/browseexpservice/v1/context/'+contextId)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Context Data' + data);
                    setContextData(data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        } else {
            
            let contextCookie = Cookies.get('contextCookie');
            console.log('fetching context information from cookie', contextCookie);
            if (contextCookie) {
                fetch('https://localhost:8443/browseexpservice/v1/context/'+contextCookie)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Context Data' + data);
                    setContextData(data);
                })
                .catch((err) => {
                    console.log(err.message);
                });
                } else {
                fetch('https://localhost:8443/browseexpservice/v1/context/create')
                .then((response) => response.json())
                .then((data) => {
                    console.log('Context Data' + data);
                    data.customerId='';
                    data.orderId='';       
                    Cookies.set('contextCookie', data?.contextId, { domain: 'sephora.com' });
                    setContextData(data);
                })
                .catch((err) => {
                    console.log(err.message);
                    return null;
                });
            }
        }
        
      }, []);


      useEffect(() => {
        
        console.log('inside useData' + contextData);
        if (contextData?.contextId) {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contextData)
          };
          fetch('https://localhost:8443/browseexpservice/v1/context/'+contextData.contextId, requestOptions)
              .then(response => response.json())
              .then(data => {
                
                console.log('Updated context in service' + data);
              });
        }
      }, [contextData]);
      

    

    console.log("contextData----", contextData);

    console.log("Context Data inside Order MFE", contextData);
    return (
        <Context.Provider value={[contextData,setContextData]} >
            {props.children}
        </Context.Provider>
    )
}

export default ProviderComponent;