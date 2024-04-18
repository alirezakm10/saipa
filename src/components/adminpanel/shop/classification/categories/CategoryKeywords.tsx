"use client";
import { useState, useEffect } from "react";
import {
  Chip,
  Autocomplete,
  Box,
  Divider,
  CircularProgress,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { Typography } from "@mui/joy";
import { btnVariants } from "../animationVariants";
import {
  useGetCatKeywordsQuery,
  useGetKeywordsListQuery,
  useUpdateKeyToCatMutation,
} from "@/redux/services/shop/productsClassificationApi";
import { Keyword, SharedCategory } from "./typescope";
import useToast from "@/hooks/useToast";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectedProductCategory } from "@/redux/features/shop/productsClassificationSlice";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import usePermission from "@/hooks/usePermission";
interface KeywordOptionType {
  inputValue?: string;
  id?: number;
  title?: string;
}

const filter = createFilterOptions<KeywordOptionType>(); // from mui

const CategoryKeywords: React.FC = () => {
  const dispatch = useAppDispatch();
  const showToast = useToast();
  const [modified, setIsModified] = useState<boolean>(false);
  const [attachedKeys, setAttachedKeys] = useState<Keyword[]>([]);
  const [value, setValue] = useState<KeywordOptionType | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const selectedCat = useAppSelector(selectedProductCategory);
  const { hasPermission } = usePermission();

  // get queries
  const {
    data: keylistResult,
    isLoading: keylistLoader,
    isSuccess: keylistStatus,
  } = useGetKeywordsListQuery("");
  const {
    data: catkeysResult,
    isLoading: catKeysLoader,
    isSuccess: catKeysStatus,
    isFetching,
  } = useGetCatKeywordsQuery(selectedCat.id, {
    refetchOnMountOrArgChange: true,
  });
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

  const handleSave = () => {
    const titleArray = attachedKeys.map((attachedKey) => attachedKey.title);
    updateKeyToSpec({
      category_id: selectedCat?.id,
      keywords: titleArray,
    });
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
    if (catKeysStatus) {
      setAttachedKeys(catkeysResult?.keywords);
      setSelectedKeywords(
        catkeysResult?.keywords.map((keyword: Keyword) => keyword.title)
      );
    }
  }, [catKeysStatus, catkeysResult, isFetching, selectedCat]);

  let content;

  if (catKeysStatus) {
    content = (
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          my={1}
        >
          <Typography>
            لیست کلمه کلیدی های متصل شده به دسته بندی - {selectedCat?.title}
          </Typography>

          {hasPermission("Classification.edit") && (
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
              renderOption={(props, option) => (
                <li {...props}>{option.title}</li>
              )}
              sx={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="افزودن کلمات کلیدی" />
              )}
            />
          )}
          {/* reusble component get items as prop for checkbox dropdown */}
        </Box>
        <Box>
          <Divider />
          <AnimatePresence>
            {modified && (
              <motion.div
                initial={btnVariants.initial}
                exit={btnVariants.hidden}
                variants={btnVariants}
                animate={modified ? "visible" : "hidden"}
              >
                <LoadingButton
                  size="small"
                  color="primary"
                  onClick={handleSave}
                  disabled={mutationLoader}
                  loading={mutationLoader}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  sx={{ my: 2 }}
                >
                  ذخیره
                </LoadingButton>
              </motion.div>
            )}
          </AnimatePresence>
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
                    onDelete={
                      hasPermission("Classification.edit") ||
                      keyword.isModified
                        ? () => handleDelete(keyword)
                        : undefined
                    }
                  />
                ))}
              </Box>
            </>
          ) : isFetching || catKeysLoader ? (
            <TimeLoader />
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
      </>
    );
  }

  if (catKeysLoader) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return content;
};

export default CategoryKeywords;
