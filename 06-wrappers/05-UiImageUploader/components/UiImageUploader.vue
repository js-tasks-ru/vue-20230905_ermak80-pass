<template>
  <div class="image-uploader">
    <label class="image-uploader__preview" :class ="{'image-uploader__preview-loading':statmet == Staments.loading}" :style="`--bg-url: url(${img_url})`">
      <span class="image-uploader__text">{{ message }}</span>
      <component :is="tag" ref='input' type="file" accept="image/*" v-bind="$attrs"  @change="sectedFile($event.target.files[0])" @click="removeImg()" class="image-uploader__input" />
    </label>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'UiImageUploader',

  data(){
    return{
      Staments:{
        default:'default',
        preview:'preview',
        loading:'loading',
        loaded:'loaded',
        reseted:'reseted',
      },  
      statmet: '',
      objUrl: null,
    }
  },
  props:{
    preview:String,
    uploader: [String, Function],
  },
  created(){
    this.statmet = this.Staments.default
    if(this.preview) this.statmet = this.Staments.preview
  },
  computed:{
    img_url(){
      let img_url = ''
      if(this.statmet==this.Staments.preview) img_url = this.preview
      if(this.statmet==this.Staments.loaded) img_url = this.objUrl
      return img_url
    },
    message(){
      let message = ''
      switch(this.statmet){
        case this.Staments.default: message = 'Загрузить изображение';break;
        case this.Staments.preview: message = 'Удалить изображение';break;
        case this.Staments.loading: message = 'Загрузка...';break;
        case this.Staments.loaded: message = 'Удалить изображение';break;
        case this.Staments.reseted: message = 'Загрузить изображение';break;
      }
      return message
    },
    tag(){
      let tag = "input"
      if(this.statmet == this.Staments.loaded||this.statmet == this.Staments.preview) tag ='button'
      return tag
    }
  },
  emits:['select', 'remove', 'error', 'upload'],
  methods:{
    async sectedFile(file){
      this.statmet = this.Staments.loading
      this.$emit('select',file)
      if(this.uploader){
        let result
        try{
          result = await this.uploader(file)
        }catch(err){
          this.$emit('error',err)
        }
        if(result) {
          this.$emit('upload',result)
          this.objUrl = URL.createObjectURL(file)
          this.statmet = this.Staments.loaded
        } else {
          this.$refs.input.value = ''
          this.statmet = this.Staments.default  
        }
      }else{
        this.objUrl = URL.createObjectURL(file)
        this.statmet = this.Staments.loaded       
      }
    },
    removeImg(){
      if(this.statmet == this.Staments.loading) return false
      this.$emit('remove')
      URL.revokeObjectURL(this.objUrl)
      this.$refs.input.value = ''
      this.statmet = this.Staments.reseted
    }
  }

};
</script>

<style scoped>
.image-uploader {
}

.image-uploader__input {
  opacity: 0;
  height: 0;
}

.image-uploader__preview {
  --bg-url: var(--default-cover);
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), var(--bg-url);
  border: 2px solid var(--blue-light);
  border-radius: 8px;
  transition: 0.2s border-color;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 512px;
  height: 228px;
}

.image-uploader__text {
  color: var(--white);
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
}

.image-uploader__preview:hover {
  border-color: var(--blue);
}

.image-uploader__preview.image-uploader__preview-loading {
  cursor: no-drop;
}
</style>
