import { SignUpModule } from "@page/sign-up/sign-up.context";
import { SignUpModel } from "@page/sign-up/sign-up.model";
import SignUpPage from "@page/sign-up/sign-up";

import { PaymentPanel } from "@page/sign-up/tab/payment";
import { AddressPanel } from "@page/sign-up/tab/address";
import { SkillPanel } from "@page/sign-up/tab/skill";
import { UserPanel } from "@page/sign-up/tab/user";

import UserContact from "@svg/user-contact.svg";
import UserAddress from "@svg/user-address.svg";
import UserPayment from "@svg/user-payment.svg";
import UserSkills from "@svg/user-skills.svg";

const Icons = {UserContact, UserAddress, UserPayment, UserSkills};

export {
    Icons,
    SignUpModule, SignUpModel, SignUpPage,
    UserPanel, SkillPanel, AddressPanel, PaymentPanel
};
