import Layout from "@/layout/Layout";
import NavigationButton from "@/components/atoms/buttons/NavigationButton";
import Title from "@/components/atoms/texts/Title";
import RequiredText from "@/components/atoms/texts/RequiredText";
import StrongText from "@/components/atoms/texts/StrongText";
import NoteText from "@/components/atoms/texts/NoteText";
import { useNavigate, Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import ErrorPage from "@/pages/ErrorPage";
import LoadingPage from "@/pages/LoadingPage";
import SimCardInfo from "@/pages/ProductSelection/components/SimCardInfo";
import SimCardTypeInfo from "@/pages/ProductSelection/components/SimCardTypeInfo";
import OffpeakInfo from "@/pages/ProductSelection/components/OffpeakInfo";
import CampaignInfo from "@/pages/ProductSelection/components/CampaignInfo";
import MonthlyFeeDetail from "@/pages/ProductSelection/components/MonthlyFeeDetail";
import SimTypeEnum from "@/enums/SimTypeEnum";
import SimCardTypeEnum from "@/enums/SimCardTypeEnum";
import ContractTypeEnum from "@/enums/ContractTypeEnum";

import {
  ProductSelectionType,
  ProductSelectionSchema,
} from "@/schema/ProductSelectionSchema";
import useRegisterStore from "@/store/useRegisterStore";

import { showMonthlyFee } from "@/lib/utils";
import { usePlans } from "@/services/QueryService";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PlanTypeEnum from "@/enums/PlanTypeEnum";

const ProductSelection: React.FC = () => {
  const navigate = useNavigate();

  const { isPending, error, data } = usePlans();

  const { productSelection, contract, setProductSelection } =
    useRegisterStore();

  const form = useForm<ProductSelectionType>({
    resolver: zodResolver(ProductSelectionSchema),
    defaultValues: { ...productSelection },
  });

  if (isPending) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  const onSubmit = (formValues: ProductSelectionType) => {
    setProductSelection(formValues);
    if (formValues.simType === SimTypeEnum.E_SIM) {
      navigate("/eid-input");
    } else {
      navigate("/customer-information");
    }
  };

  const singlePlanIids = data.planInfos.reduce(
    (acc: string[], plan) => (plan.optionIid ? acc : [...acc, plan.mpIid]),
    []
  );

  const simCardTypeChangeHandle = (value: string) => {
    if (value == SimCardTypeEnum.DATA) {
      form.setValue("planType", PlanTypeEnum.NORMAL);
    }
    form.setValue("planIid", "");
    form.setValue("optionIids", []);
  };

  const planTypeChangeHanlde = (value: string) => {
    form.setValue("planIid", "");
  };

  const planIidChangeHanlde = (value: string) => {
    if (!singlePlanIids.includes(value)) {
      form.setValue("kakehoOption", "");
    }
  };

  const currentOptionIids = form.getValues("optionIids");
  const optionIidChangeHandle = (value: string, optionIid: string) => {
    if (value) {
      if (!currentOptionIids.includes(value)) {
        form.setValue("optionIids", [...currentOptionIids, value]);
      }
    } else {
      form.setValue(
        "optionIids",
        currentOptionIids.filter((item) => item != optionIid)
      );
    }
  };

  return (
    <Layout progressValue={15}>
      <Title>プラン・各種オプションの設定</Title>
      <NoteText className="text-center block m-4">
        金須はすべて税込です。
      </NoteText>

      <div className="mt-8 mb-12 space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="simType"
              render={({ field }) => (
                <FormItem>
                  <h2>
                    <RequiredText /> <StrongText>SIMタイプ</StrongText>
                  </h2>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <label
                        htmlFor="normal_sim-select"
                        className="radio-box-label"
                      >
                        <RadioGroupItem
                          value={SimTypeEnum.NORMAL_SIM}
                          id="normal_sim-select"
                        />
                        <p>SIMカード</p>
                      </label>
                      <label htmlFor="e_sim-select" className="radio-box-label">
                        <RadioGroupItem
                          value={SimTypeEnum.E_SIM}
                          id="e_sim-select"
                        />
                        <p>eSIM</p>
                      </label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-end">
                    <SimCardInfo />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="simCardType"
              render={({ field }) => (
                <FormItem>
                  <h2>
                    <RequiredText /> <StrongText>SIMカードタイプ</StrongText>
                  </h2>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        simCardTypeChangeHandle(value);
                      }}
                      defaultValue={field.value}
                    >
                      <label
                        htmlFor="voice_sim-select"
                        className="radio-box-label"
                      >
                        <RadioGroupItem
                          value={SimCardTypeEnum.VOICE}
                          id="voice_sim-select"
                        />
                        <div>
                          <p>音声SIMカード</p>
                          <NoteText className="block">
                            通常利用ならこっちがおすすめ！
                          </NoteText>
                        </div>
                      </label>

                      {contract.contractType == ContractTypeEnum.NEW && (
                        <label
                          htmlFor="data_sim-select"
                          className="radio-box-label"
                        >
                          <RadioGroupItem
                            value={SimCardTypeEnum.DATA}
                            id="data_sim-select"
                          />
                          <div>
                            <p>データSIMカード</p>
                            <NoteText className="block">
                              2台目やタプレット利用におすすめ!
                            </NoteText>
                          </div>
                        </label>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-end">
                    <SimCardTypeInfo />
                  </div>
                </FormItem>
              )}
            />

            <CampaignInfo />

            <FormField
              control={form.control}
              name="planType"
              render={({ field }) => (
                <FormItem>
                  <h2>
                    <RequiredText /> <StrongText>プラン</StrongText>
                  </h2>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        planTypeChangeHanlde(value);
                      }}
                      defaultValue={field.value}
                      value={form.watch("planType")}
                    >
                      <label
                        htmlFor="normal_plan-select"
                        className="radio-box-label"
                      >
                        <RadioGroupItem
                          value={PlanTypeEnum.NORMAL}
                          id="normal_plan-select"
                        />
                        <p>通常プラン</p>
                      </label>
                      {form.getValues("simCardType") ===
                        SimCardTypeEnum.VOICE && (
                        <label
                          htmlFor="offpeak_plan-select"
                          className="radio-box-label"
                        >
                          <RadioGroupItem
                            value={PlanTypeEnum.OFFPEAK}
                            id="offpeak_plan-select"
                          />
                          <p>オフピークプラン</p>
                        </label>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planIid"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        planIidChangeHanlde(value);
                      }}
                      defaultValue={field.value}
                      value={form.watch("planIid")}
                    >
                      {form.getValues("simCardType") ===
                        SimCardTypeEnum.VOICE && (
                        <>
                          <StrongText>
                            音声SIM限定かけ放題セットプラン
                          </StrongText>
                          {data?.planInfos
                            .filter(
                              (plan) =>
                                plan.optionIid &&
                                plan.isOffPeakPlan ==
                                  (form.getValues("planType") ===
                                  PlanTypeEnum.OFFPEAK
                                    ? 1
                                    : 0)
                            )
                            .map((plan) => (
                              <label
                                key={plan.mpIid}
                                htmlFor={"select" + plan.mpIid}
                                className="radio-box-label"
                              >
                                <RadioGroupItem
                                  value={plan.mpIid}
                                  id={"select" + plan.mpIid}
                                />
                                <div className="flex items-center justify-between w-full">
                                  <p>{plan.name}</p>
                                  <p>{showMonthlyFee(plan.planFee)}</p>
                                </div>
                              </label>
                            ))}
                        </>
                      )}
                      <StrongText className="mt-6">普通プラン</StrongText>
                      {data?.planInfos
                        .filter(
                          (plan) =>
                            !plan.optionIid &&
                            plan.simType.toString() ===
                              form.getValues("simCardType") &&
                            plan.isOffPeakPlan ===
                              (form.getValues("planType") ===
                              PlanTypeEnum.OFFPEAK
                                ? 1
                                : 0)
                        )
                        .map((plan) => (
                          <label
                            key={plan.mpIid}
                            htmlFor={"select" + plan.mpIid}
                            className="radio-box-label"
                          >
                            <RadioGroupItem
                              value={plan.mpIid}
                              id={"select" + plan.mpIid}
                            />
                            <div className="flex items-center justify-between w-full">
                              <p>{plan.name}</p>
                              <p>{showMonthlyFee(plan.planFee)}</p>
                            </div>
                          </label>
                        ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {singlePlanIids.includes(form.watch("planIid")) &&
              form.getValues("simCardType") === SimCardTypeEnum.VOICE && (
                <FormField
                  control={form.control}
                  name="kakehoOption"
                  render={({ field }) => (
                    <FormItem>
                      <h2>
                        <RequiredText /> <StrongText>通話オプション</StrongText>
                      </h2>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {data?.optionInfos
                            .filter((option) => option.isKakeho)
                            .map((option) => (
                              <label
                                htmlFor={option.iid + "select"}
                                className="radio-box-label"
                                key={option.iid}
                              >
                                <RadioGroupItem
                                  value={option.iid}
                                  id={option.iid + "select"}
                                />
                                <div className="flex items-center justify-between w-full">
                                  <p>{option.name}</p>
                                  <p>{showMonthlyFee(option.optionFee)}</p>
                                </div>
                              </label>
                            ))}
                          <label
                            htmlFor="none_kakeho-select"
                            className="radio-box-label"
                          >
                            <RadioGroupItem value="" id="none_kakeho-select" />
                            <div className="flex items-center justify-between w-full">
                              <p>つけない</p>
                              <p>国内通話30秒/11円</p>
                            </div>
                          </label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <FormField
              control={form.control}
              name="optionIids"
              render={({ field }) => (
                <>
                  {data?.optionInfos
                    .filter(
                      (option) =>
                        !option.isKakeho &&
                        option.isVoice ===
                          (form.getValues("simCardType") ===
                          SimCardTypeEnum.VOICE
                            ? 1
                            : 0)
                    )
                    .map((option) => (
                      <FormItem key={option.iid}>
                        <h2>
                          <RequiredText />{" "}
                          <StrongText>{option.name}</StrongText>
                        </h2>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) =>
                              optionIidChangeHandle(value, option.iid)
                            }
                            defaultValue={
                              form.getValues("optionIids").includes(option.iid)
                                ? option.iid
                                : ""
                            }
                          >
                            <label
                              htmlFor={option.iid + "select"}
                              className="radio-box-label"
                            >
                              <RadioGroupItem
                                value={option.iid}
                                id={option.iid + "select"}
                              />
                              <div className="flex items-center justify-between w-full">
                                <p>つける</p>
                                <p>{showMonthlyFee(option.optionFee)}</p>
                              </div>
                            </label>
                            <label
                              htmlFor={"none" + option.iid + "select"}
                              className="radio-box-label"
                            >
                              <RadioGroupItem
                                value=""
                                id={"none" + option.iid + "select"}
                              />
                              <p>つけない</p>
                            </label>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    ))}
                </>
              )}
            />

            <div className="flex justify-center space-x-2">
              <NavigationButton
                variant="back"
                className="w-1/3"
                onClick={() => navigate(-1)}
              >
                戻る
              </NavigationButton>
              <NavigationButton type="submit" className="w-2/3">
                次へ
              </NavigationButton>
            </div>
          </form>
        </Form>
      </div>
      <MonthlyFeeDetail planData={data} form={form} />
    </Layout>
  );
};

export default ProductSelection;
