import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Post} from "./post.model";
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts(){
    //return [...this.posts];
    this.http.get<{message: string, posts: Post[]}>("http://localhost:3000/api/posts").subscribe(res =>{
      console.log("res --> ", res);
      this.posts = res.posts;
      this.postsUpdated.next([...this.posts]);
    }, err =>{
      console.log("err --> ", err);
    });
  }

  getPostUpdatedListener(){
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string){
    console.log("addPost --> title ", title);
    console.log("addPost --> content ", content);

    const post: Post = { id:null, title: title, content: content};

    console.log("post --> ", post);
    this.http.post<{message: string}>("http://localhost:3000/api/posts", post).subscribe(res => {
      console.log("res --> ", res.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    }, err =>{
      console.log("err --> ", err);
    })

  }

}
