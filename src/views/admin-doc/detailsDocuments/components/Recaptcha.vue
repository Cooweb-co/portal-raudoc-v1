<template>
    <vueRecaptcha
        sitekey="6Lflb6EpAAAAAOwAmPQFdNTSBVN-cVwdH7ekJdFT"
        class="d-flex justify-content-center align-items-center pt-3"
        size="normal"
        theme="light"
        hl="sp"
        @verify="recaptchaVerified"
        @expire="recaptchaExpired"
        @fail="recaptchaFailed"
        @error="recaptchaError"
        ref="vueRecaptcha"
    >
    </vueRecaptcha>
</template>

<script>
import vueRecaptcha from "vue3-recaptcha2";

export default {
    name: "app",
    emits: {
      verified(value) {
        console.log(value)
        return value
      },
    },
    components: {
        vueRecaptcha,
    },
    methods: {
        recaptchaVerified() {
          this.$emit('verified', true)
        },
        recaptchaExpired() {
            this.$emit('verified', false)
            this.$refs.vueRecaptcha.reset();
        },
        recaptchaFailed() {
          this.$emit('verified', false)
        },
        recaptchaError(reason) {
          this.$emit('verified', false)
            console.error(reason);
        },
    },
};
</script>
