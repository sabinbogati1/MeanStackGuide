import { Component, OnInit, EventEmitter, Output} from "@angular/core";
import { NgForm, FormGroup, Validators, FormControl } from "@angular/forms";
import {PostService} from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {

  form: FormGroup;
  enteredContent = "";
  enteredTitle = "";
  post: Post;
  private mode = "create";
  private postId: string;
  imagePreview: string;
  isLoading = false;

  constructor(private postService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.form = new FormGroup({
      "title": new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      "content": new FormControl(null, { validators: [Validators.required] }),
      "image": new FormControl(null)
    });


    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      if (paramMap.has("postId")){
          this.mode = "edit";
          this.postId = paramMap.get("postId");
          // this.post = this.postService.getPost(this.postId);

          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = { id: postData._id, title: postData.title, content: postData.content };
            this.form.setValue({ "title": this.post.title, "content": this.post.content });
          });

      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {

    if (this.form.invalid) {
      return ;
    }

    if (this.mode === "create") {
      this.postService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    console.log("file :", file);
    console.log("this.form :: ", this.form);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }

    reader.readAsDataURL(file);

  }

}
