import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Post} from "./post.model";
 import {map} from "rxjs/operators";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  //private posts: Post[] = [];
  private posts;
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

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

  getPost(id: string){
    //return {...this.posts.find(p => p.id === id)};
    return this.http.get<{_id: string; title: string; content: string}>("http://localhost:3000/api/posts/" + id);
  }

  addPost(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    //const post: Post = { id:null, title: title, content: content};

    // console.log("post --> ", post);
    this.http.post<{message: string, postId: string}>("http://localhost:3000/api/posts", postData).subscribe(responseData => {
      const post: Post = { id:responseData.postId, title: title, content: content};

      // const postId = res.postId;
      // post.id = postId;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);
    }, err =>{
      console.log("err --> ", err);
    });

  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {id: id, title: title, content: content};
    this.http.put("http://localhost:3000/api/posts/"+ id,post)
      .subscribe(response =>{
       const updatedPosts = [...this.posts];
       const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
       updatedPosts[oldPostIndex] = post;
       this.posts = updatedPosts;
       this.postsUpdated.next([...this.posts]);
       this.router.navigate(["/"]);
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
