import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Post} from "./post.model";
 import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class PostService {

  //private posts: Post[] = [];
  private posts;
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts(){
   /// return [...this.posts];

   this.http.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
   .pipe(map((postData) =>{
     console.log("post Data --> ", postData);
     return postData.posts.map(post => {
       return {
         title: post.title,
         content: post.content,
         id: post._id
       };
     });
   })).subscribe(transformedPosts => {
     console.log("Transformed post --> ", transformedPosts);
     this.posts = transformedPosts;
     this.postsUpdated.next([...this.posts]);
   });


  //  this.http.get<{message: string, posts: any}>("http://localhost:3000/api/posts").subscribe(res =>{
  //     console.log("res --> ", res);
  //     this.posts = res.posts;
  //     this.postsUpdated.next([...this.posts]);
  //   }, err =>{
  //     console.log("err --> ", err);
  //   });

    // this.http.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
    // .pipe(map(postData =>{
    //     return postData.posts.map(post => {

    //     })
    // }))
  }

  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string){
    console.log("addPost --> title ", title);
    console.log("addPost --> content ", content);

    const post: Post = { id:null, title: title, content: content};

    console.log("post --> ", post);
    this.http.post<{message: string, postId: string}>("http://localhost:3000/api/posts", post).subscribe(res => {
      console.log("res of addPost --> ", res );
      console.log("res --> ", res.message);

      const postId = res.postId;
      post.id = postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    }, err =>{
      console.log("err --> ", err);
    });

  }

  deletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts/" + postId).subscribe(
      () =>{

        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log("Deleted...");
      }
    );
  }


}
