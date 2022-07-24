import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
} from "@chakra-ui/react"
import "easymde/dist/easymde.min.css"
import dynamic from "next/dynamic"
import Image from "next/image"
import { erc20Chains } from "../utils/Lit"

/* configure the markdown editor to be client-side import */

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
    isUseEncryption,
    setIsUseEncryption,
    erc20EncryptToken,
    setErc20EncryptToken,
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

      <Box>
        <Checkbox onChange={(e) => setIsUseEncryption(e.target.checked)}>
          Use encryption
        </Checkbox>
      </Box>

      {isUseEncryption && (
        <>
          <FormControl
            variant="floating"
            id="erc20Address"
            isRequired
            isInvalid={postError.erc20EncryptToken}
            my={5}
          >
            <FormLabel>Address</FormLabel>
            <Input
              onChange={(e) => {
                setErc20EncryptToken({
                  ...erc20EncryptToken,
                  address: e.target.value,
                })
              }}
              name="ERC20 Address"
              placeholder="Please fill the token address..."
              value={erc20EncryptToken.address}
              _placeholder={{ color: "inherit" }}
            />
            <FormErrorMessage>Please enter a title</FormErrorMessage>
          </FormControl>

          <FormControl
            variant="floating"
            id="erc20EncryptToken"
            isRequired
            isInvalid={postError.erc20EncryptToken}
            my={5}
          >
            <FormLabel>Minimum Balance</FormLabel>
            <NumberInput
              type="number"
              step={1}
              onChange={(value) => {
                setErc20EncryptToken({
                  ...erc20EncryptToken,
                  minBalance: value,
                })
              }}
              name="Minimum balance"
              placeholder="How much of the token does the reader need to have?"
              value={erc20EncryptToken.minBalance}
              _placeholder={{ color: "inherit" }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>Please enter a title</FormErrorMessage>
          </FormControl>

          <FormControl
            variant="floating"
            id="erc20Chain"
            isRequired
            isInvalid={postError.erc20EncryptToken}
            my={5}
          >
            <FormLabel>Chain</FormLabel>
            <Select
              placeholder="Select Chain"
              value={erc20EncryptToken.chain}
              onChange={(e) =>
                setErc20EncryptToken({
                  ...erc20EncryptToken,
                  chain: e.target.value,
                })
              }
            >
              {erc20Chains.map((name: string, index: number) => (
                <option key={index} value={index}>
                  {name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Please select a chain</FormErrorMessage>
          </FormControl>
        </>
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
