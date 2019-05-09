import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {PostService} from "../post.service";
import {Post} from "../post.model";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  // posts= [
  //   {title: "First Post", content: "This is the first post's content"},
  //   {title: "Second Post", content: "This is the Second post's content"},
  //   {title: "Third Post", content: "This is the Third post's content"}
  // ];

  posts:Post[] = [];
  private postsSub: Subscription;

  constructor(private postService: PostService ) { }

  ngOnInit() {
    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdatedListener().subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
