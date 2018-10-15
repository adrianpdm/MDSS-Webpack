<template>
    <el-container
        class="c_import-data-container">
        <el-main class="c_import-data-content">
            <transition name="slideY-fade" mode="out-in">
                <div
                    :key="`filename`"
                    v-if="(isFileSelected || isSaving) && isValidFileType">
                    <span class="c_file-is-valid">
                        {{`${file.name}  (${getFileSize})`}}
                    </span>
                    <br/>
                    <el-button
                        v-if="isValidFileType"
                        :disabled="!isValidFileType"
                        type="primary"
                        class="c_import-data-button vspace"
                        @click="onStartUpload">
                        Upload
                    </el-button>
                </div>
                <div
                    v-else-if="isInitial"
                    class="vspace">
                    <span
                        v-if="isInitial && !isFileSelected"
                        class="c_text-of-no-data">
                        {{prompt}}
                    </span>
                    <br/>
                    <el-button type="primary" class="c_import-data-button vspace">
                        <form enctype="multipart/form-data">
                            <input type="file"
                                   :accept="fileExtension"
                                   :name="inputName"
                                   class="c_import-data-form-input-file"
                                   @change="onFilesChange($event.target.name, $event.target.files)"/>
                        </form>
                        {{buttonText}}
                    </el-button>
                </div>
            </transition>
        </el-main>
    </el-container>
</template>

<script>
    const STATUS_INITIAL = 0
    const STATUS_SELECTED = 1
    const STATUS_SAVING = 2
    const STATUS_SUCCESS = 3
    const STATUS_FAILED = 4

    export default {
        props: {
            acceptedType: {
                type: String,
                required: true,
                enum: ["excel"]
            },
            inputName: {
                type: String,
                required: true
            },
            prompt: {
                type: String,
            },
            buttonText: {
                type: String
            },
            uploadMethod: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                isImportDialogVisible: false,
                isLoading: false,
                uploadStatus: STATUS_INITIAL,
                file: undefined,
                targetURL: "http://localhost:8081/imports/failure-records",
            }
        },
        computed: {
            fileExtension() {
                switch (this.acceptedType) {
                    case "excel":
                        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    default:
                        return ""
                }
            },
            isInitial() {
                return this.uploadStatus === STATUS_INITIAL
            },
            isFileSelected() {
                return this.uploadStatus === STATUS_SELECTED
            },
            isSaving() {
                return this.uploadStatus === STATUS_SAVING
            },
            isSuccess() {
                return this.uploadStatus === STATUS_SUCCESS
            },
            isFailed() {
                return this.uploadStatus === STATUS_FAILED
            },
            isValidFileType() {
                if (!this.file) {
                    return false
                }
                return this.file.type === this.fileExtension
            },
            getFileSize() {
                if (!this.file) {
                    return ""
                }
                let size = this._.round(this.file.size / 1000, 1)
                return size + " KB"
            },
        },
        methods: {
            reset() {
                this.uploadStatus = STATUS_INITIAL
                this.file = undefined
            },
            saveData(formData) {
                this.uploadStatus = STATUS_SAVING
                this.uploadMethod(formData)
            },
            showLoading(show) {
                this.isLoading = show
            },
            onFilesChange(field, fileList) {
                if (fileList.length > 0) {
                    this.uploadStatus = STATUS_SELECTED
                    this.file = fileList[0]
                }
                if (!this.isValidFileType) {
                    this.$alert("File must be in Excel Spreadsheet format (*.xls, *.xlsx)", "Invalid File Type", {
                        confirmButtonText: "OK",
                        callback: () => {
                            this.reset()
                        }
                    })
                }
            },
            onStartUpload() {
                if (!this.file) {
                    return
                }

                let name = this._.toString(this.inputName)
                if (this.isValidFileType) {
                    const formData = new FormData
                    formData.append(name, this.file, this.file.name)
                    this.saveData(formData)
                } else {
                    alert("harus sesuai")
                }
            },
        },
        mounted() {
            this.reset()
        }
    }
</script>

<style scoped lang="scss">
    .c_import-data-container {
        @include box-sizing(border-box);
        position: relative;
        height: 100%;
        width: 100%;
    }

    .c_import-data-content {
        @include box-sizing(border-box);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;

        span.c_file-is-valid {
            color: $clr-blue-600;
            font-size: 20px;
            font-weight: 500;
        }

        span.c_file-is-not-valid {
            color: $clr-red-a400;
            font-size: 20px;
            font-weight: 500;
        }

        .c_text-of-no-data {
            color: $clr-blue-grey-300;
            font-size: 20px;
            font-weight: 500;
        }
    }

    .c_import-data-button {
        -webkit-transition: width 0.3s ease;
        -moz-transition: width 0.3s ease;
        -ms-transition: width 0.3s ease;
        -o-transition: width 0.3s ease;
        transition: width 0.3s ease;
    }

    .c_import-data-form-input-file {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
