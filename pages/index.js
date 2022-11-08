import Image from 'next/image';
import {DataGridPremium, GridToolbar} from "@mui/x-data-grid-premium";
import {Box} from "@mui/material";
import {useState} from "react";
import {myFont} from "../public/myFont";
import {createTheme, ThemeProvider} from "@mui/material";



export async function getStaticProps(){
    const infoData = await fetch("https://undefxx.com/api").then(res => res.json())
    const paymentsData = await fetch("https://undefxx.com/api/p", { method: "GET", headers: {uncategorized: "true"}}).then(res => res.json())

    return{
        props: {infoData, paymentsData},
        revalidate: 1
    }

}

const theme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: "#O00000",
        },
        secondary: {
            main: "#000000",
        },
    },
    typography: {
        fontFamily: myFont,
        h1:{
            fontFamily: myFont
        },
    },
});



export default function Page(props){
    console.log(99)

    console.log(props.paymentsData)





    const [infoRows, setInfoRows] = useState(dataToRows(props.infoData))
    const [infoColumns, setInfoColumns] = useState(dataToColumns(props.infoData))

    const [paymentsRepository, setPaymentsRepository] = useState(makePaymentsRepository(props.paymentsData))
    const [paymentsRows, setPaymentsRows] = useState([])
    const [paymentsColumns, setPaymentsColumns] = useState([{field: "name", headerName: "name"}, {field: "amount"}, {field: "propertyID"}])

    console.log(88)

    console.log(paymentsRepository)

    console.log(paymentsRepository["18572 Cull Canyon Rd"])
    console.log(paymentsColumns)
    function makePaymentsRepository(collection) {
        for (let unit in collection) {
            collection[unit] = dataToRows(collection[unit])
        }
        return collection
    }




    console.log(paymentsRows)
    console.log(paymentsColumns)

    function onSelectionModelChange(x){
        console.log(x)
        let newPaymentsRows = []
        for(let elem in x) {
            newPaymentsRows = newPaymentsRows.concat(paymentsRepository[x[elem]])
        }
        console.log(44)
        console.log(newPaymentsRows)
        setPaymentsRows(newPaymentsRows)
    }

    function getDetailPanelContent(props){
        return(
                <h1>{props.row.name}</h1>
        )
    }

    return (
            <div className={myFont.className}>

                <ThemeProvider theme={theme}>



            <Box sx = {{height: "100vh", width: "100vw"}}>
                <DataGridPremium
                    columns={infoColumns} rows={infoRows} checkboxSelection={true} onSelectionModelChange = {onSelectionModelChange} experimentalFeatures={{aggregation: true, newEditingApi: true}}
                getDetailPanelContent={getDetailPanelContent} getDetailPanelHeight={() => "auto"} rowReordering={true} components={{Toolbar: GridToolbar}}/>
            </Box>
            <Box sx = {{height: "100vh", width: "100vw"}}>
                <DataGridPremium columns={paymentsColumns} rows={paymentsRows} checkboxSelection={true} experimentalFeatures={{aggregation: true, newEditingApi: true}}
                    getDetailPanelContent={getDetailPanelContent} getDetailPanelHeight={() => "auto"} rowReordering={true} components={{Toolbar: GridToolbar}}  />
            </Box>
            <Box sx = {{height: "100vh", width: "100vw"}}>
                 <DataGridPremium columns={[]} rows={[]} checkboxSelection={true} experimentalFeatures={{aggregation: true, newEditingApi: true}}
                    getDetailPanelContent={getDetailPanelContent} getDetailPanelHeight={() => "auto"} rowReordering={true} components={{Toolbar: GridToolbar}}  />
             </Box>
                </ThemeProvider>
            </div>






    )

}

function dataToRows(collection){
    const returnArray = []
    for (let docID in collection) {
        let row = {id: docID}
        for(let fieldID in collection[docID] ){
            row[fieldID] = collection[docID][fieldID]
        }
        returnArray.push(row)
    }
    return returnArray
}

function dataToColumns(collection){
    let columnsAdded = []
    let returnArray = []
    for(let docID in collection) {
        for (let fieldID in collection[docID]) {
            if (!(columnsAdded.includes(fieldID))) {
                console.log(fieldID)
                returnArray.push({field: fieldID, headerName: fieldID, width: 120})
                columnsAdded.push(fieldID)
            }
        }
    }
    return returnArray
}