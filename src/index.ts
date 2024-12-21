import express from 'express';
import mongoose from 'mongoose';
import {UserModel, ContentModel} from './db';
import jwt from 'jsonwebtoken';
import {auth} from './middleware/auth';

// 
const app = express();
app.use(express.json());
async function main() {

await mongoose.connect('mongodb://localhost:5000/brain-app');
console.log('connected to mongodb');





//@ts-ignore
app.post('/api/v1/signup',async (req, res) => {

const username = req.body.username as string;
const password = req.body.password as string;
const email = req.body.email as string;

// // console.log(username);
// console.log(password);  
// console.log(email);

// console.log(req.body);
// console.log(req.body.username);
try{
await UserModel.create({
  username,
  password,
  email
},
  res.status(200).json({
    message: 'signup successful'
  }) );
  }catch(e){
    console.log(e);
  }
});

//@ts-ignore
app.post('/api/v1/signin', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user =await UserModel.findOne({username, password});

  if (user) {
    const token = jwt.sign({id:user._id}, 'secret');
    res.status(200).json({
      message: 'success',
      token
    });
  } else {
    res.status(401).json({
      message: 'Invalid Credentials'
    });
  }
});


//@ts-ignore
app.get('/api/v1/mycontent',auth,async (req, res) => {
    //@ts-ignore
  const mycontent= await ContentModel.find({userId: req.userId});
    res.status(200).json({
      message: 'success',
      mycontent
    });
});


//@ts-ignore
app.post('/api/v1/addcontent',auth,async (req, res) => {
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
console.log("add content end point")
  await ContentModel.create({
    title,
    description: '',
    link,
    type,
    //@ts-ignore
    userId: req.userId

  });
  res.json({
    message: 'content added successfully'
  });
  
});

//@ts-ignore
app.delete('/api/v1/deletecontent',auth, async (req, res) => {
  const contentId = req.body.contentId;
  //@ts-ignore
  const deleteStatus = await ContentModel.deleteOne({_id: contentId,userId: req.userId}) as unknown as boolean;
  if(deleteStatus) {
  res.status(200).json({
    message: 'Delete Successful'
  });
}
});

    //@ts-ignore
app.post('/api/v1/updatecontent',auth,async (req, res) => {
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    const contentId = req.body.contentId;
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.findOne({_id: contentId});
    if (content) {
        content.title = title;
        content.link = link;
        content.type = type;
        content.userId = userId;
        await ContentModel.updateOne({_id: contentId}, content);
        res.status(200).json({
            message: 'Update Successful'
        });


}});
//@ts-ignore
// app.get('api/v1/brain/share/:shareId', (req, res) => {

// });
app.use('/', (req,res)=>{

    res.send("This end point doesn't exist");
});

}

main()

app.listen(3000, () => {
  console.log('listening on port 3000');
});