// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class CommentCreated extends ethereum.Event {
  get params(): CommentCreated__Params {
    return new CommentCreated__Params(this);
  }
}

export class CommentCreated__Params {
  _event: CommentCreated;

  constructor(event: CommentCreated) {
    this._event = event;
  }

  get postId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get author(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get commentId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get hash(): string {
    return this._event.parameters[3].value.toString();
  }

  get createdAt(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class CommentDeleted extends ethereum.Event {
  get params(): CommentDeleted__Params {
    return new CommentDeleted__Params(this);
  }
}

export class CommentDeleted__Params {
  _event: CommentDeleted;

  constructor(event: CommentDeleted) {
    this._event = event;
  }

  get postId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get author(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get commentId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get deletedAt(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class CommentUpdated extends ethereum.Event {
  get params(): CommentUpdated__Params {
    return new CommentUpdated__Params(this);
  }
}

export class CommentUpdated__Params {
  _event: CommentUpdated;

  constructor(event: CommentUpdated) {
    this._event = event;
  }

  get postId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get author(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get commentId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get hash(): string {
    return this._event.parameters[3].value.toString();
  }

  get createdAt(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get lastUpdatedAt(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PostCreated extends ethereum.Event {
  get params(): PostCreated__Params {
    return new PostCreated__Params(this);
  }
}

export class PostCreated__Params {
  _event: PostCreated;

  constructor(event: PostCreated) {
    this._event = event;
  }

  get author(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get title(): string {
    return this._event.parameters[2].value.toString();
  }

  get hash(): string {
    return this._event.parameters[3].value.toString();
  }

  get categoryIndex(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get createdAt(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class PostUpdated extends ethereum.Event {
  get params(): PostUpdated__Params {
    return new PostUpdated__Params(this);
  }
}

export class PostUpdated__Params {
  _event: PostUpdated;

  constructor(event: PostUpdated) {
    this._event = event;
  }

  get author(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get id(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get title(): string {
    return this._event.parameters[2].value.toString();
  }

  get hash(): string {
    return this._event.parameters[3].value.toString();
  }

  get categoryIndex(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get published(): boolean {
    return this._event.parameters[5].value.toBoolean();
  }

  get createdAt(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get lastUpdatedAt(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }
}

export class Community__fetchCommentsOfPostResultValue0Struct extends ethereum.Tuple {
  get author(): Address {
    return this[0].toAddress();
  }

  get id(): BigInt {
    return this[1].toBigInt();
  }

  get postId(): BigInt {
    return this[2].toBigInt();
  }

  get content(): string {
    return this[3].toString();
  }

  get createdAt(): BigInt {
    return this[4].toBigInt();
  }

  get lastUpdatedAt(): BigInt {
    return this[5].toBigInt();
  }
}

export class Community__fetchPostByHashResultValue0Struct extends ethereum.Tuple {
  get author(): Address {
    return this[0].toAddress();
  }

  get id(): BigInt {
    return this[1].toBigInt();
  }

  get title(): string {
    return this[2].toString();
  }

  get content(): string {
    return this[3].toString();
  }

  get categoryIndex(): BigInt {
    return this[4].toBigInt();
  }

  get published(): boolean {
    return this[5].toBoolean();
  }

  get createdAt(): BigInt {
    return this[6].toBigInt();
  }

  get lastUpdatedAt(): BigInt {
    return this[7].toBigInt();
  }
}

export class Community__fetchPostByIdResultValue0Struct extends ethereum.Tuple {
  get author(): Address {
    return this[0].toAddress();
  }

  get id(): BigInt {
    return this[1].toBigInt();
  }

  get title(): string {
    return this[2].toString();
  }

  get content(): string {
    return this[3].toString();
  }

  get categoryIndex(): BigInt {
    return this[4].toBigInt();
  }

  get published(): boolean {
    return this[5].toBoolean();
  }

  get createdAt(): BigInt {
    return this[6].toBigInt();
  }

  get lastUpdatedAt(): BigInt {
    return this[7].toBigInt();
  }
}

export class Community__fetchPostsResultValue0Struct extends ethereum.Tuple {
  get author(): Address {
    return this[0].toAddress();
  }

  get id(): BigInt {
    return this[1].toBigInt();
  }

  get title(): string {
    return this[2].toString();
  }

  get content(): string {
    return this[3].toString();
  }

  get categoryIndex(): BigInt {
    return this[4].toBigInt();
  }

  get published(): boolean {
    return this[5].toBoolean();
  }

  get createdAt(): BigInt {
    return this[6].toBigInt();
  }

  get lastUpdatedAt(): BigInt {
    return this[7].toBigInt();
  }
}

export class Community extends ethereum.SmartContract {
  static bind(address: Address): Community {
    return new Community("Community", address);
  }

  fetchCategories(): Array<string> {
    let result = super.call(
      "fetchCategories",
      "fetchCategories():(string[])",
      []
    );

    return result[0].toStringArray();
  }

  try_fetchCategories(): ethereum.CallResult<Array<string>> {
    let result = super.tryCall(
      "fetchCategories",
      "fetchCategories():(string[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toStringArray());
  }

  fetchCommentsOfPost(
    postId: BigInt
  ): Array<Community__fetchCommentsOfPostResultValue0Struct> {
    let result = super.call(
      "fetchCommentsOfPost",
      "fetchCommentsOfPost(uint256):((address,uint256,uint256,string,uint256,uint256)[])",
      [ethereum.Value.fromUnsignedBigInt(postId)]
    );

    return result[0].toTupleArray<
      Community__fetchCommentsOfPostResultValue0Struct
    >();
  }

  try_fetchCommentsOfPost(
    postId: BigInt
  ): ethereum.CallResult<
    Array<Community__fetchCommentsOfPostResultValue0Struct>
  > {
    let result = super.tryCall(
      "fetchCommentsOfPost",
      "fetchCommentsOfPost(uint256):((address,uint256,uint256,string,uint256,uint256)[])",
      [ethereum.Value.fromUnsignedBigInt(postId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<Community__fetchCommentsOfPostResultValue0Struct>()
    );
  }

  fetchPostByHash(hash: string): Community__fetchPostByHashResultValue0Struct {
    let result = super.call(
      "fetchPostByHash",
      "fetchPostByHash(string):((address,uint256,string,string,uint256,bool,uint256,uint256))",
      [ethereum.Value.fromString(hash)]
    );

    return changetype<Community__fetchPostByHashResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_fetchPostByHash(
    hash: string
  ): ethereum.CallResult<Community__fetchPostByHashResultValue0Struct> {
    let result = super.tryCall(
      "fetchPostByHash",
      "fetchPostByHash(string):((address,uint256,string,string,uint256,bool,uint256,uint256))",
      [ethereum.Value.fromString(hash)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<Community__fetchPostByHashResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  fetchPostById(postId: BigInt): Community__fetchPostByIdResultValue0Struct {
    let result = super.call(
      "fetchPostById",
      "fetchPostById(uint256):((address,uint256,string,string,uint256,bool,uint256,uint256))",
      [ethereum.Value.fromUnsignedBigInt(postId)]
    );

    return changetype<Community__fetchPostByIdResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_fetchPostById(
    postId: BigInt
  ): ethereum.CallResult<Community__fetchPostByIdResultValue0Struct> {
    let result = super.tryCall(
      "fetchPostById",
      "fetchPostById(uint256):((address,uint256,string,string,uint256,bool,uint256,uint256))",
      [ethereum.Value.fromUnsignedBigInt(postId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<Community__fetchPostByIdResultValue0Struct>(value[0].toTuple())
    );
  }

  fetchPosts(): Array<Community__fetchPostsResultValue0Struct> {
    let result = super.call(
      "fetchPosts",
      "fetchPosts():((address,uint256,string,string,uint256,bool,uint256,uint256)[])",
      []
    );

    return result[0].toTupleArray<Community__fetchPostsResultValue0Struct>();
  }

  try_fetchPosts(): ethereum.CallResult<
    Array<Community__fetchPostsResultValue0Struct>
  > {
    let result = super.tryCall(
      "fetchPosts",
      "fetchPosts():((address,uint256,string,string,uint256,bool,uint256,uint256)[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      value[0].toTupleArray<Community__fetchPostsResultValue0Struct>()
    );
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _name(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateCategoryCall extends ethereum.Call {
  get inputs(): CreateCategoryCall__Inputs {
    return new CreateCategoryCall__Inputs(this);
  }

  get outputs(): CreateCategoryCall__Outputs {
    return new CreateCategoryCall__Outputs(this);
  }
}

export class CreateCategoryCall__Inputs {
  _call: CreateCategoryCall;

  constructor(call: CreateCategoryCall) {
    this._call = call;
  }

  get _name(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class CreateCategoryCall__Outputs {
  _call: CreateCategoryCall;

  constructor(call: CreateCategoryCall) {
    this._call = call;
  }
}

export class CreateCommentCall extends ethereum.Call {
  get inputs(): CreateCommentCall__Inputs {
    return new CreateCommentCall__Inputs(this);
  }

  get outputs(): CreateCommentCall__Outputs {
    return new CreateCommentCall__Outputs(this);
  }
}

export class CreateCommentCall__Inputs {
  _call: CreateCommentCall;

  constructor(call: CreateCommentCall) {
    this._call = call;
  }

  get postId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get hash(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class CreateCommentCall__Outputs {
  _call: CreateCommentCall;

  constructor(call: CreateCommentCall) {
    this._call = call;
  }
}

export class CreatePostCall extends ethereum.Call {
  get inputs(): CreatePostCall__Inputs {
    return new CreatePostCall__Inputs(this);
  }

  get outputs(): CreatePostCall__Outputs {
    return new CreatePostCall__Outputs(this);
  }
}

export class CreatePostCall__Inputs {
  _call: CreatePostCall;

  constructor(call: CreatePostCall) {
    this._call = call;
  }

  get title(): string {
    return this._call.inputValues[0].value.toString();
  }

  get hash(): string {
    return this._call.inputValues[1].value.toString();
  }

  get categoryIndex(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class CreatePostCall__Outputs {
  _call: CreatePostCall;

  constructor(call: CreatePostCall) {
    this._call = call;
  }
}

export class DeleteCommentCall extends ethereum.Call {
  get inputs(): DeleteCommentCall__Inputs {
    return new DeleteCommentCall__Inputs(this);
  }

  get outputs(): DeleteCommentCall__Outputs {
    return new DeleteCommentCall__Outputs(this);
  }
}

export class DeleteCommentCall__Inputs {
  _call: DeleteCommentCall;

  constructor(call: DeleteCommentCall) {
    this._call = call;
  }

  get postId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get commentId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DeleteCommentCall__Outputs {
  _call: DeleteCommentCall;

  constructor(call: DeleteCommentCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UpdateCommentCall extends ethereum.Call {
  get inputs(): UpdateCommentCall__Inputs {
    return new UpdateCommentCall__Inputs(this);
  }

  get outputs(): UpdateCommentCall__Outputs {
    return new UpdateCommentCall__Outputs(this);
  }
}

export class UpdateCommentCall__Inputs {
  _call: UpdateCommentCall;

  constructor(call: UpdateCommentCall) {
    this._call = call;
  }

  get postId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get commentId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get hash(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class UpdateCommentCall__Outputs {
  _call: UpdateCommentCall;

  constructor(call: UpdateCommentCall) {
    this._call = call;
  }
}

export class UpdateNameCall extends ethereum.Call {
  get inputs(): UpdateNameCall__Inputs {
    return new UpdateNameCall__Inputs(this);
  }

  get outputs(): UpdateNameCall__Outputs {
    return new UpdateNameCall__Outputs(this);
  }
}

export class UpdateNameCall__Inputs {
  _call: UpdateNameCall;

  constructor(call: UpdateNameCall) {
    this._call = call;
  }

  get _name(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class UpdateNameCall__Outputs {
  _call: UpdateNameCall;

  constructor(call: UpdateNameCall) {
    this._call = call;
  }
}

export class UpdatePostCall extends ethereum.Call {
  get inputs(): UpdatePostCall__Inputs {
    return new UpdatePostCall__Inputs(this);
  }

  get outputs(): UpdatePostCall__Outputs {
    return new UpdatePostCall__Outputs(this);
  }
}

export class UpdatePostCall__Inputs {
  _call: UpdatePostCall;

  constructor(call: UpdatePostCall) {
    this._call = call;
  }

  get postId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get title(): string {
    return this._call.inputValues[1].value.toString();
  }

  get hash(): string {
    return this._call.inputValues[2].value.toString();
  }

  get categoryIndex(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get published(): boolean {
    return this._call.inputValues[4].value.toBoolean();
  }
}

export class UpdatePostCall__Outputs {
  _call: UpdatePostCall;

  constructor(call: UpdatePostCall) {
    this._call = call;
  }
}