import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Post, NewNotifications } from './home/post-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsCollection: AngularFirestoreCollection<Post>;
  postsDoc: AngularFirestoreDocument<Post>;
  posts : Observable<Post[]>;

  newNotificationsCollection:AngularFirestoreCollection<NewNotifications>;
  newNotificationsDoc: AngularFirestoreDocument<NewNotifications>;
  newNotifications: Observable<NewNotifications[]>;
  

  constructor(public fs: AngularFirestore) {
    
    this.postsCollection = this.fs.collection('posts');
    this.posts = this.postsCollection.snapshotChanges().pipe(
      map(changes =>{
        return changes.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          data.id = id;
          return data;
        });
    }));

    this.newNotificationsCollection = this.fs.collection('newNotifications')
    this.newNotifications = this.newNotificationsCollection.snapshotChanges().pipe(
      map(actions =>{
        return actions.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          data.id = id;
          return data;
        });
    })); 

   }

   getNotifications(){
     return this.newNotifications;
   }
   incrementNotifications(notifications:NewNotifications){
    this.newNotificationsDoc = this.fs.doc(`newNotifications/${notifications.id}`);
    notifications.count = notifications.count + 1;
    this.newNotificationsDoc.update(notifications);
   }
   clearNotifications(notifications:NewNotifications){
    this.newNotificationsDoc = this.fs.doc(`newNotifications/${notifications.id}`);
    notifications.count = 0;
    this.newNotificationsDoc.update(notifications);
   }
   getPosts(){
     return this.posts;
   }
   addPost(post:Post, notifications:NewNotifications){
     this.incrementNotifications(notifications);
     this.postsCollection.add(post);
   }
   deletePost(post:Post, notifications:NewNotifications){
    this.incrementNotifications(notifications);
    this.postsDoc = this.fs.doc(`posts/${post.id}`);
    this.postsDoc.delete();
   }

   updatePost(post:Post, notifications:NewNotifications){
    this.incrementNotifications(notifications);
    this.postsDoc = this.fs.doc(`posts/${post.id}`);
    this.postsDoc.update(post);
   }
}
