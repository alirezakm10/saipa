"use client";
import { useState, useEffect } from "react";
import {
  Chip,
  Autocomplete,
  Box,
  Divider,
  Paper,
  TextField,
  createFilterOptions,
  useTheme,
} from "@mui/material";
import { Typography } from "@mui/joy";
import {
  useGetKeywordsListQuery,
  useUpdateKeyToCatMutation,
} from "@/redux/services/shop/productsClassificationApi";
import { Keyword } from "../shop/classification/categories/typescope";
import useToast from "@/hooks/useToast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectedProduct,
  setProduct,
} from "@/redux/features/shop/productSlice";
import { tokens } from "@/theme";
import { setKeywords } from "@/redux/features/keywordsCatcherSlice";

interface KeywordOptionType {
  inputValue?: string;
  id?: number;
  title?: string;
}

const filter = createFilterOptions<KeywordOptionType>(); // from mui

interface Props {
  keywords?: Keyword[];
}

const KeywordsBox: React.FC<Props> = ({ keywords }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useAppDispatch();
  const showToast = useToast();
  const [modified, setIsModified] = useState<boolean>(false);
  const post = useAppSelector(selectedProduct);
  const [attachedKeys, setAttachedKeys] = useState<Keyword[]>([]);
  const [value, setValue] = useState<KeywordOptionType | null>(null);
  // get queries
  const {
    data: keylistResult,
    isLoading: keylistLoader,
    isSuccess: keylistStatus,
  } = useGetKeywordsListQuery("");

  // mutation queries
  const [
    updateKeyToSpec,
    {
      isLoading: mutationLoader,
      isSuccess: mutationStatus,
      data: mutationResult,
      error: mutationError,
    },
  ] = useUpdateKeyToCatMutation<any>();

  const handleDelete = (keyword: Keyword) => {
    const updatedAttachedKeys = attachedKeys.filter(
      (key) => key.id !== keyword.id
    );
    setAttachedKeys(updatedAttachedKeys);
    setIsModified(true);
  };

  useEffect(() => {
    if (mutationStatus) {
      showToast(mutationResult?.message, "success");
    }
    if (mutationError) {
      const errMsg = mutationError?.data.message;
      showToast(errMsg, "error");
    }
  }, [mutationResult, mutationStatus, mutationError]);

  useEffect(() => {
    const titleArray = attachedKeys.map((attachedKey) => attachedKey.title);
    dispatch(setProduct({ ...post, keywords: titleArray }));
    dispatch(setKeywords(titleArray))
  }, [attachedKeys]);

  useEffect(() => {
    // Modify the received data to change the key from "keyword" to "title"
    if (keywords) {
      const modifiedKeywords = keywords.map((keyword: Keyword) => ({
        ...keyword,
        title: keyword.keyword || keyword.title,
      }));
      setAttachedKeys(modifiedKeywords);
    }
  }, [keywords]);

  return (
    <Paper
      sx={{
        position: "relative",
        overflowY: "auto",
        height: "300px",
        p: 2,
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: "5px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        gap={2}
        my={1}
      >
        <Typography>
          لیست کلمه کلیدی های متصل شده به دسته بندی - {post?.category_title}
        </Typography>

        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
            } else if (newValue && newValue.inputValue) {
              // setSelectedKeywords([...selectedKeywords, newValue.inputValue]);
              setAttachedKeys([
                ...attachedKeys,
                { ...newValue, isModified: true },
              ]);
              setIsModified(true);
            } else if (newValue) {
              setAttachedKeys([
                ...attachedKeys,
                { ...newValue, isModified: true },
              ]);
              setIsModified(true);
            }
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.title
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                title: `${inputValue}`,
              });
            }

            return filtered;
          }}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="free-solo-with-text-demo"
          options={keylistResult?.data}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.title || "";
          }}
          renderOption={(props, option) => <li {...props}>{option.title}</li>}
          fullWidth
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label="افزودن کلمات کلیدی" />
          )}
        />
        {/* reusble component get items as prop for checkbox dropdown */}
      </Box>
      <Box>
        <Divider />
        {attachedKeys.length > 0 ? (
          <>
            <Box
              display="flex"
              flexDirection="row"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
              gap={2}
              sx={{ p: 1 }}
            >
              {attachedKeys.map((keyword: Keyword, idx: number) => (
                <Chip
                  key={idx}
                  label={keyword.title}
                  variant="outlined"
                  color={keyword.isModified ? "success" : "default"}
                  onDelete={() => handleDelete(keyword)}
                />
              ))}
            </Box>
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={2}
          >
            کلمه کلیدی برای این محصول ثبت نشده است
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default KeywordsBox;
