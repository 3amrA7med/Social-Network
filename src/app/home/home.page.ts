import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service'; 
import { Post, NewNotifications } from './post-interface';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  postValue : string;
  newNotifications : NewNotifications;
  addReply : Boolean;
  addReplyPostId : string;
  posts : Post[];
  replyValue : string;
  newPost: Post;
  replies:string[] = [];

  constructor(private postService: PostService) {
    this.addReply = false;
    this.addReplyPostId = '';
    this.replyValue = '';
    this.newPost = {likes:0,replies:[],value:''};
    this.newNotifications = {count:0};
  }

  ngOnInit(){
    this.postService.getPosts().subscribe(
      posts =>{
        this.posts = posts;
      }
    )
    this.postService.getNotifications().subscribe(
      notifications=>{
        this.newNotifications = notifications[0];
      }
    )
  }
  submit(){
    if(this.postValue != '')
    {
      this.newPost.value = this.postValue;
      this.postService.addPost(this.newPost,this.newNotifications);
      this.postValue = '';
    }
    
  }
  clearNotifcation():void{
    this.postService.clearNotifications(this.newNotifications);
  }
  reply(post:Post):void{
    post.replies.push(this.replyValue);
    this.postService.updatePost(post, this.newNotifications);
    this.toggleReplyField(post.id);
  }
  delete(post:Post):void{
    this.postService.deletePost(post, this.newNotifications);
  }

  like(post:Post):void{
    post.likes = post.likes+1;
    this.postService.updatePost(post, this.newNotifications);
  }

  toggleReplyField(id:string){
    if(id == this.addReplyPostId)
    {
      this.addReplyPostId = '';
      this.addReply = false;
    }
    else{
      this.addReplyPostId = id;
      this.addReply = true;  
    }
    this.replyValue = '';
  }
}
