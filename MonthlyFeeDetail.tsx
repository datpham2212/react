import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { ArrowBigUpDash } from "lucide-react";
import Footer from "@/layout/Footer";
import InfoRow from "@/components/molecules/displays/InfoRow";
import StrongText from "@/components/atoms/texts/StrongText";
import type { PlanData } from "@/type/PlanData";
import type { UseFormReturn } from "react-hook-form";
import { ProductSelectionType } from "@/schema/ProductSelectionSchema";
import { showMonthlyFee } from "@/lib/utils";

interface MonthlyFeeProps {
  planData: PlanData | undefined;
  form: UseFormReturn<ProductSelectionType>;
}
const MonthlyFeeDetail: React.FC<MonthlyFeeProps> = ({ planData, form }) => {
  const selectedPlan = planData?.planInfos.find(
    (plan) => plan.mpIid === form.getValues("planIid")
  );

  const seletedKakehoOption = planData?.optionInfos.find(
    (option) => option.isKakeho && option.iid === form.getValues("kakehoOption")
  );

  const selectedOptions = planData?.optionInfos.filter((option) =>
    form.watch("optionIids").includes(option.iid)
  );

  const totalFee =
    (selectedPlan?.planFee ?? 0) +
    (seletedKakehoOption?.optionFee ?? 0) +
    (selectedOptions?.reduce((acc, item) => acc + item.optionFee, 0) ?? 0);

  return (
    <Footer className="flex items-center justify-between backdrop-blur-xl bg-white/50">
      <p>月々のお支払い金額</p>
      <p>
        <StrongText size="lg" className="text-primary">
          {totalFee}
        </StrongText>
        円/月
      </p>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">
            <ArrowBigUpDash />
            内訳を見る
          </Button>
        </DrawerTrigger>
        <DrawerContent className="font-sans text-gray-700 font-medium ">
          <div className="mx-auto w-full sm:max-w-md">
            <DrawerHeader className="text-left">
              <DrawerTitle className="text-black">内訳(税込)</DrawerTitle>
            </DrawerHeader>
            <div className="mb-2 p-4 space-y-2">
              {selectedPlan && (
                <InfoRow>
                  <p>{selectedPlan.name}</p>
                  <p>{showMonthlyFee(selectedPlan.planFee)}</p>
                </InfoRow>
              )}

              {seletedKakehoOption && (
                <InfoRow>
                  <p>{seletedKakehoOption.name}</p>
                  <p>{showMonthlyFee(seletedKakehoOption.optionFee)}</p>
                </InfoRow>
              )}

              {selectedOptions?.map((option) => (
                <InfoRow key={option.iid}>
                  <p>{option.name}</p>
                  <p>{showMonthlyFee(option.optionFee)}</p>
                </InfoRow>
              ))}
            </div>
            <DrawerFooter className="flex-row items-center justify-between border-t-2 border-gray-300">
              <p>月々のお支払い金額</p>
              <p>
                <StrongText size="lg" className="text-primary">
                  {totalFee}
                </StrongText>
                円/月
              </p>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </Footer>
  );
};

export default MonthlyFeeDetail;
