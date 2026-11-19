import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import ConfigurationError from "../../components/shared/ConfigurationError";
import PageLoader from "../../components/shared/PageLoader";
import { categories, categoryPath } from "../../data/questionnaires";
import { useCategories } from "../../hooks/useResearch";
import { useDrafts } from "../../hooks/useDrafts";
import { isSupabaseConfigured } from "../../lib/supabase";

const requiredText = (message) => z
  .string()
  .trim()
  .min(1, message)
  .max(200, "Use 200 characters or fewer.");

const wholeNumber = (message) => z
  .string()
  .trim()
  .min(1, message)
  .regex(/^\d+$/, "Enter a whole number.")
  .transform(Number)
  .refine(Number.isSafeInteger, "Enter a smaller whole number.");

const schema = z.object({
  businessName: requiredText("Enter your business or organisation name."),
  contactName: requiredText("Enter the contact person’s full name."),
  jobPosition: requiredText("Enter your job position."),
  yearsExperience: wholeNumber("Enter your years of experience."),
  employeeCount: wholeNumber("Enter the number of employees."),
  yearsOperating: wholeNumber("Enter how long the company has been operating."),
});

export default function InformationPage() {
  const { category: slug } = useParams();
  const metadata = categories[slug];
  const navigate = useNavigate();
  const {
    data: categoryRows = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { startDraft } = useDrafts();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });
  const category = categoryRows.find((item) => item.slug === slug);

  if (!isSupabaseConfigured) return <ConfigurationError />;
  if (!metadata)
    return (
      <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs">
        <p className="max-w-[460px] m-0 text-center leading-[1.7]">
          This stakeholder category is not supported.
        </p>
        <Link to="/select-category">Choose a category</Link>
      </div>
    );
  if (categoriesLoading)
    return <PageLoader label="Loading stakeholder category…" />;
  if (categoriesError)
    return <ConfigurationError message={categoriesError.message} />;
  if (!category)
    return (
      <div className="question-loading min-h-screen flex flex-col justify-center items-center gap-[13px] text-[#6f8092] bg-[#f6f9fc] text-xs">
        <p className="max-w-[460px] m-0 text-center leading-[1.7]">
          This stakeholder category is not available in the research database.
        </p>
        <Link to="/select-category">Choose another category</Link>
      </div>
    );

  const onSubmit = (values) => {
    const respondent = {
      name: values.contactName.trim(),
      business: values.businessName.trim(),
      jobPosition: values.jobPosition.trim(),
      yearsExperience: values.yearsExperience,
      employeeCount: values.employeeCount,
      yearsOperating: values.yearsOperating,
    };
    startDraft(slug, false, respondent);
    navigate(categoryPath(slug, "questions"));
  };

  return (
    <div className="form-page min-h-screen bg-page">
      <div className="form-layout w-[min(100%_-_48px,_1060px)] min-h-[calc(100vh_-_66px)] my-0 mx-auto pt-[37px] px-0 pb-[52px] grid items-start gap-[65px] max-tablet:gap-[30px] max-mobile:w-[min(100%_-_36px,_520px)] max-mobile:pt-5 max-mobile:px-0 max-mobile:pb-[34px] max-mobile:flex max-mobile:flex-col max-mobile:gap-[21px]">
        <section className="form-main pt-2 max-mobile:w-full max-mobile:p-0">
          <div className="form-progress-meta flex justify-between text-[#8a98a9] text-[9px]">
            <span className="first:text-green first:text-[8px] first:font-bold first:tracking-[.7px]">
              STEP 02 OF 03
            </span>
            <span className="first:text-green first:text-[8px] first:font-bold first:tracking-[.7px]">
              Business information
            </span>
          </div>
          <div className="form-progress h-0.75 mt-2.5 overflow-hidden rounded-[10px] bg-[#e6edf2]">
            <span
              style={{ width: "33%" }}
              className="h-full block rounded-[inherit] bg-green"
            />
          </div>
          <header className="form-heading mt-[25px] mx-0 mb-[22px]">
            <h1 className="mt-0 mx-0 mb-1 text-navy font-display text-[19px] tracking-[-.45px]">
              Tell us about your business
            </h1>
          </header>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-grid grid grid-cols-2 gap-y-[15px] gap-x-[13px] max-mobile:gap-y-[13px] gap-x-2.5">
              <Field
                label="Business / organisation name"
                name="businessName"
                placeholder="e.g. Acacia Healthcare Ltd"
                register={register}
                error={errors.businessName}
                required
              />
              <Field
                label="Contact person’s full name"
                name="contactName"
                placeholder="Full name"
                register={register}
                error={errors.contactName}
                required
              />
              <Field
                label="Job position"
                name="jobPosition"
                placeholder="e.g. Operations Manager"
                register={register}
                error={errors.jobPosition}
                required
              />
              <Field
                label="Years of experience"
                name="yearsExperience"
                placeholder="e.g. 5"
                type="number"
                min="0"
                step="1"
                register={register}
                error={errors.yearsExperience}
                required
              />
              <Field
                label="Number of employees"
                name="employeeCount"
                placeholder="e.g. 25"
                type="number"
                min="0"
                step="1"
                register={register}
                error={errors.employeeCount}
                required
              />
              <Field
                label="How long has the company been operating? (years)"
                name="yearsOperating"
                placeholder="e.g. 10"
                type="number"
                min="0"
                step="1"
                register={register}
                error={errors.yearsOperating}
                required
              />
            </div>
            <div className="form-submit-row mt-6 flex justify-end items-center gap-3 max-mobile:items-stretch max-mobile:flex-col-reverse max-mobile:gap-3">
              <button
                className="button button-green min-h-[42px] py-0 px-4 border border-transparent rounded-lg inline-flex items-center justify-center gap-[9px] text-xs font-bold transition-all duration-200 enabled:hover:-translate-y-px text-white bg-green shadow-[0_5px_13px_rgba(7,155,89,.13)] enabled:hover:bg-green-dark enabled:hover:shadow-[0_8px_18px_rgba(7,155,89,.2)] max-mobile:w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="spin animate-spin" size={17} />
                    Starting…
                  </>
                ) : (
                  <>
                    Continue to questions <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  min,
  step,
  register,
  error,
  required,
}) {
  return (
    <label className="form-field min-w-0 flex flex-col gap-1.5 text-[#344a62] text-[10px] font-semibold max-mobile:text-[9px]">
      <span>
        {label} {required && <b className="text-[#e2725e]">*</b>}
      </span>
      <input
        type={type}
        min={min}
        step={step}
        placeholder={placeholder}
        autoComplete="on"
        maxLength={200}
        {...register(name)}
        aria-invalid={Boolean(error)}
        className="w-full h-10 py-0 px-[11px] outline-none border border-[#dfe6ed] rounded-[7px] text-[#203751] bg-white text-[10px] transition-colors duration-200 placeholder:text-[#a5b0bc] focus:border-[#57ba89] focus:shadow-[0_0_0_3px_rgba(7,155,89,.09)] aria-invalid:border-[#dc7868] max-mobile:h-[39px] max-mobile:py-0 max-mobile:px-[9px] max-mobile:text-[9px]"
      />
      {error && (
        <small className="field-error text-[#be4f44] text-[9px] font-medium">
          {error.message}
        </small>
      )}
    </label>
  );
}
