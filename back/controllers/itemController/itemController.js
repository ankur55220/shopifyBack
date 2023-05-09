const express=require('express');
const Item = require('../../models/category')
const List=require('../../models/list')
const Save=require('../../models/saveList')


exports.getAllItem =async (req,res)=>{
    

    try{
        const total=await Item.find();

        if(!total){
            return res.status(400).json({
                error:"not found"
            })
        }

        res.status(200).json({
            data:total
        })
    }
    catch(err){
     console.log(err)
    }
   

}


exports.addNewItem= async (req,res)=>{


    try{

    
    const {name,category,note,photo} = req.body;

    
    if(!name || !category ||!photo){
        return res.status(400).json({error:"fields cannot be empty"})
    }

    const resp=await Item.findOne({name:category});

    if(!resp){

        const newdoc=new Item({
            name:category,
            items:[
                {
                    name:req.body.name,
                    photo:req.body.photo,
                    note:req.body.note
                }
            ]
        })

        await newdoc.save();

        return res.status(200).json({success:"success"})
    }
const test=await resp.items.find((ele)=>(ele.name===name));

if(test){

    const newItems= await resp.items.filter((ele)=>ele.name!=name)

    newItems.push({

        name:req.body.name,
        photo:req.body.photo,
        note:req.body.note
    
    })

    resp.items=newItems

    await resp.save();
    return res.status(200).json({success:"edited"})
}

resp.items.push({

    name:req.body.name,
    photo:req.body.photo,
    note:req.body.note

})

await resp.save()

return res.status(200).json({success:"success"})

   
}
catch(err){

    console.log(err)
    
    res.status(400).json({error:"something went wrong"})
}

}

exports.deleteFromList= async (req,res)=>{


    try{

        const {name}= req.body

        const present= await List.findOne({"items.name":name});

        if(!present){
            return res.status(400).json({error:"no such item exists"})
        }

        const del= await List.findOne({"items.name":name,"items.quantity":1})



        

        if(del){

            if(del.items.length>1){
                await List.findByIdAndUpdate(del._id,{$pull:{items:{name:req.body.name}}})
            }else{
                await List.findByIdAndDelete(del._id)
            }
            return res.status(200).json({success:"success"})
        }


        const dec=await List.findOneAndUpdate({"items.name":name},{$inc:{"items.$.quantity":-1}})
        


        return res.status(200).json({success:"success"})



    }
    catch(err){


        console.log(err)
        return res.status(400).json({error:"something went wrong"})
    }
}


exports.deleteList= async (req,res)=>{

    try{

        const {name}= req.body;

        const present = await List.findOne({"Items.name":name});

        if(!present){

            return res.status(400).json({error:"file not found"})
        }

        


        if(present.items.length==1){
            
            await List.findByIdAndDelete(present._id)

            return res.status(200).json({success:"sucess"});

        }

        const res0=await List.findByIdAndUpdate(present._id,{$pull:{items:{name:name}}})

        return res.status(200).json({success:"sucess"});



    }
    catch(err){

        

        return res.status(400).json({error:"something went wrong"})
    }
}

exports.addToList=async (req,res)=>{
    try{
     
        const {category,name}=req.body

       
        const data=await List.findOne({"items.name":name});

        


        if(data){

            const res0=await List.findOneAndUpdate({"items.name":name},{$inc:{"items.$.quantity":1}});
            

            

            return res.status(200).json({success:"successful"});
        }

        const found=await List.findOne({name:category});

        if(found){
            found.items.push({name:name,quantity:1});
            await found.save()
            return res.status(200).json({success:"succesful"})
        }
        const newdata=new List({
            name:category,
            items:[]
        })

        newdata.items.push({name:name,quantity:1});

        await newdata.save();

        return res.status(200).json({data:newdata});


    }catch(err){
        res.status(400).json({error:"something went wrong"})
    }
}


exports.getAlllists=async (req,res)=>{

    try{

        const newdata= await List.find();

        

    if(!newdata){
        return res.status(200).json({data:"no data available "});
    }

    res.status(200).json({data:newdata});


    }
    catch(err){
        return res.status(400).json({error:"something went wrong"})
    }

    



}


exports.switch= async(req,res)=>{

    try{
        const {name} = req.body;


        const result = await List.findOne({"items.name":name})

        if(!result){

            return res.status(400).json({error:"item does not exists"})
        }

        

        result.items.forEach((ele)=>{
            if(ele.name==name){
                ele.completed=!ele.completed
            }
        })

        const newdata=await result.save();

    
        
        return res.status(200).json({success:"success"})

    }
    catch(err){

        console.log(err)
        return res.status(400).json({error:"something went wrong"})
    }
}

exports.listCompleted = async(req,res)=>{

    try{

        const result=await List.find({"items.completed":false})

        

        if(result.length>0){
            return res.status(200).json({status:false})
        }else{
            return res.status(200).json({status:true})
        }

    }
    catch(err){

        console.log(err)
        return res.status(400).json({error:"something went wrong"})
    }
}

exports.saveList= async (req,res)=>{
  try{

    const result=req.body;

    if(result.lists.length==0){
        return res.status(400).json({error:"feild cant be empty"})
    }

    const present=await Save.findOne({name:result.name})

    


    if(present!=null){
        const update=await Save.findByIdAndUpdate(present._id,{
            name:result.name,
            completed:result.status,
            lists:[...result.lists]

        })

        await List.deleteMany()

        return res.status(200).json({success:"success"})

    }
    const res1=await Save.create(result)

    await res1.save();

    await List.deleteMany()

    return res.status(200).json({success:"success"})

    

   

  }
  catch(err){
    console.log(err)
    return res.status(400).json({error:"something went wrong"})
  }
}


exports.getSave=async (req,res)=>{
    try{

        const result = await Save.find().sort({updatedAt:-1}).limit(10)

        if(!result){
            return res.status(400).json({error:"not found"})
        }

       
        return res.status(200).json({data:result});

        

        


    }
    catch(err){

        
      console.log(err)

        return res.status(400).json({error:"something went wrong"})

    }
}

exports.getSingleItem = async (req,res)=>{
    try{

        const {id}=req.body

        
        const result= await Save.findById(id);

        if(!result){
            return res.status(400).json({error:"not found"})
        }


        return res.status(200).json({data:result})


    }
    catch(err){
        return res.status(400).json({error:"something went wrong"})
    }
}


exports.reAddtoList= async (req,res)=>{

    try{

        const data=req.body.data;

        

        if(!data){
            return res.status(400).json({error:"no data to add"})
        }

        for(const ele of data){

            const newdata= new List({
                name:ele.name,
                items:ele.items
            })

            await newdata.save()

        }

        return res.status(200).json({success:"success"})

    }
    catch(err){

       
        return res.status(400).json({error:"something went wrong"})
    }
    

}


exports.clearSave= async(req,res)=>{
    try{


        
        await List.deleteMany()

        return res.status(200).json({success:"success"})

    }
    catch(err){

        return res.status(400).json({error:"error"})
    }
}

exports.saveToggle= async (req,res)=>{

    try{

        const {id,status}=req.body;
 
        console.log(req.body)
        
        const result=await Save.findById(id);

        if(!result){

            return res.status(400).json({error:"no susch data found"})
        }

        result.completed=status

        await result.save()

        return res.status(200).json({success:"success"})



    }
    catch(err){

        console.log(err)
        return res.status(400).json({error:"something went wrong"})
    }
}





exports.percentage=async (req,res)=>{

    try{

        const result= await Save.find();


        let totalCat=0;

        let indie={}


        let totalItem=0;

        let itemIndie={}


        result.forEach((ele)=>{
            

            totalCat+=ele.lists.length

            ele.lists.forEach((el)=>{

                const curr=el.name;
                if(indie[`${curr}`]>=0){
                    indie[`${curr}`]++;
                }else{
                    indie[`${curr}`]=1
                }


                totalItem+=el.items.length;

                el.items.forEach((it)=>{

                    const curr=it.name;
                    if(itemIndie[`${curr}`]>=0){
                        itemIndie[`${curr}`]++;
                    }else{
                        itemIndie[`${curr}`]=1
                    }

                })


            })
            
        })
  
        
        
      const topItems = Object.keys(itemIndie).map((item,index)=>{
        
        let per=(itemIndie[item]/totalItem) * 100

        return {
            name:item,
            per:Math.floor(per)
        }
      })
      
      topItems.sort((a,b)=>(b.per>a.per?1:a.per>b.per?-1:0))

      const topCat = Object.keys(indie).map((c,index)=>{
        let per=(indie[c]/totalCat)*100

        return {
            name:c,
            per:Math.floor(per)
        }
      })

      topCat.sort((a,b)=>(b.per>a.per?1:a.per>b.per?-1:0))
      

    
      return res.status(200).json({data:{items:topItems,cat:topCat}})
    }
    catch(err){
        return res.status(400).json({error:"error"})
    }

}


exports.search= async (req,res)=>{


    
    try{

        const {name}=req.body

        const result= await Item.findOne({"items.name":name})

       


        if(!result){

            console.log(req.body)
            return res.status(200).json({error:"not found"})
        }


        const newData= result.items.filter((ele)=>{
           return ele.name==name
        
        })

        return res.status(200).json({success:{cat:result.name,item:newData[0]}})


    }
    catch(err){
      
        console.log(err)

        return res.status(400).json({error:"something went wrong"})
    }
}