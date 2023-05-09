

const express= require("express");

const route = express.Router();
const itemController=require('../../controllers/itemController/itemController')

route.route('/').get(itemController.getAllItem)
route.route('/addnew/').post(itemController.addNewItem)

route.route('/addtolist').post(itemController.addToList)

route.route('/getList').get(itemController.getAlllists)
route.route('/declist').post(itemController.deleteFromList)
route.route('/deletelist').post(itemController.deleteList)

route.route('/switch').post(itemController.switch)
route.route('/iscomplete').get(itemController.listCompleted)
route.route('/save').post(itemController.saveList)
route.route('/getsave').get(itemController.getSave)
route.route('/getsingleitem').post(itemController.getSingleItem)
route.route('/reAdd').post(itemController.reAddtoList)
route.route('/clear').get(itemController.clearSave)
route.route('/savetoggle').post(itemController.saveToggle)
route.route('/getstat').get(itemController.percentage)
route.route('/search').post(itemController.search)









module.exports= route;
