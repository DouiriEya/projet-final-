const express= require('express') ; 
const router = express.Router() ; 
const {createPost, updatePost , deletePost,viewPost,searchPosts,getPostById}= require('../controllers/postController') ; 


// create post route (post method);  testitha te5dem 
router.post('/createPost/:userId',createPost) ; 
// update the content of the post donc update http request ; testitha te5dem 
router.put('/updatePost/:postId',updatePost) ;
// delete lel post  , tested w te5dem jawha bhy 
router.delete('/deletePost/:postId',deletePost) ;

// view the posts for a given user  , tested w te5dem 
router.get('/viewPost/:userId',viewPost) ;

// get a post by its id
router.get('/posts', getPostById);

// looking for posts 
router.get('/searchpost',searchPosts);
module.exports= router ;