import { defineAclRules, createAcl } from "vue-simple-acl"; 
import { useRouter } from "vue-router";

const router = useRouter()
const user = JSON.parse(sessionStorage.getItem('authUserInfo'))

// console.log(user);

const rules = () => defineAclRules((setRule) => {
  // Define a simple rule for ability with no argument
  setRule('is-logued', (user) => user.isActive);
  setRule('is-Direction', (user) => user.areaId == 200)
  setRule('is-internal-control', (user) => user.areaId == 210)
  setRule('is-planification', (user) => user.areaId == 220)
  setRule('is-legal-office', (user) => user.areaId == 230)
  setRule('is-Ambiental', (user) => user.areaId == 300)
  setRule('is-administrative', (user) => user.areaId == 410)

});

const simpleAcl = createAcl({
  user, // short for user: user
  rules, // short for rules: rules
  router, // OPTIONAL, short for router: router 
  // other optional vue-simple-acl options here... See Vue Simple ACL Options below
});

export default simpleAcl;