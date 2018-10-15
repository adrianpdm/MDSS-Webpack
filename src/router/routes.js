import HomePage from "../pages/Base/HomePage"
import BaseNotFoundPage from "../pages/Base/BaseNotFoundPage"
import DataExplorer from "../pages/Data/DataExplorer"

const routes = [
    {
        path: "/",
        component: HomePage,
        children: [
            {
                path: "data",
                component: DataExplorer,
            },
        ]
    },
    {
        path: "*",
        component: BaseNotFoundPage
    }
]

export default routes
