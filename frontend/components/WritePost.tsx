import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Spinner,
} from "@chakra-ui/react"
import React from "react"
import "easymde/dist/easymde.min.css"
import Image from "next/image"
import dynamic from "next/dynamic"

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
})

export default function WritePost(props: any) {
  const {
    mode,
    isLoading,
    post,
    postError,
    image,
    categories,
    selectedCategory,
    onChangeSelectedCategory,
    onTitleInputChange,
    onMDEditorChange,
    handleFileChange,
    fileRef,
    triggerOnChange,
    submitPost,
  } = props

  return (
    <>
      <FormControl
        variant="floating"
        id="title"
        isRequired
        isInvalid={postError.title}
        my={5}
      >
        <FormLabel>Title</FormLabel>
        <Input
          onChange={onTitleInputChange}
          name="title"
          placeholder="Give it a title ..."
          value={post.title}
          _placeholder={{ color: "inherit" }}
        />
        <FormHelperText>Keep it short and sweet!</FormHelperText>
        <FormErrorMessage>Please enter a title</FormErrorMessage>
      </FormControl>

      <FormControl
        variant="floating"
        id="content"
        isRequired
        isInvalid={postError.content}
        my={5}
      >
        <FormLabel>Content</FormLabel>
        <SimpleMDE
          placeholder="What's on your mind?"
          value={post.content}
          onChange={onMDEditorChange}
        />
        <FormErrorMessage>Please fill content</FormErrorMessage>
      </FormControl>

      <FormControl
        variant="floating"
        id="categoryIndex"
        isInvalid={postError.categoryIndex}
        my={5}
      >
        <FormLabel>Category</FormLabel>
        <Select
          placeholder="Select Category"
          value={selectedCategory}
          onChange={onChangeSelectedCategory}
        >
          {categories.map((category: string, index: number) => (
            <option key={index} value={index}>
              {category}
            </option>
          ))}
        </Select>
        <FormErrorMessage>Please select a category</FormErrorMessage>
      </FormControl>

      {image && (
        <Image
          src={URL.createObjectURL(image)}
          alt="Cover image"
          width="100%"
          height="100%"
          objectFit="contain"
          crossOrigin="anonymous"
          unoptimized={true}
        />
      )}

      <Box my={5}>
        <Input
          id="selectImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileRef}
          style={{ display: "none" }}
        />
        <Button minW={150} onClick={triggerOnChange} isDisabled={isLoading}>
          {isLoading ? (
            <Spinner />
          ) : mode === "create" ? (
            "Add cover image"
          ) : (
            "Change cover image"
          )}
        </Button>

        <Button minW={150} ml={5} onClick={submitPost} isDisabled={isLoading}>
          {isLoading ? (
            <Spinner />
          ) : mode === "create" ? (
            "Publish"
          ) : (
            "Publish changes"
          )}
        </Button>
      </Box>
    </>
  )
}
