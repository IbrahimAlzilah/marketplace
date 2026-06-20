"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { contactSchema, type ContactForm } from "@/lib/validations/auth";
import { Mail, MessageCircle, Phone } from "lucide-react";

export function ContactPage() {
  const t = useTranslations("help");
  const tc = useTranslations("common");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSubmitted(true);
    reset();
  };

  return (
    <div className="container-marketplace py-6 lg:py-6">
      <h1 className="mb-2 text-2xl font-bold lg:text-3xl">{t("contactTitle")}</h1>
      <p className="mb-8 text-muted-foreground">{t("contactSubtitle")}</p>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{t("phone")}</p>
                <p className="text-sm text-muted-foreground">920000000</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{t("emailContact")}</p>
                <p className="text-sm text-muted-foreground">support@yusur.sa</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">+966 5X XXX XXXX</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card>
            <CardContent className="p-6">
              {submitted ? (
                <div className="py-8 text-center">
                  <p className="text-lg font-medium text-success">{t("messageSent")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">{t("yourName")}</Label>
                      <Input id="name" className="mt-1" {...register("name")} />
                      {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">{t("yourEmail")}</Label>
                      <Input id="email" type="email" className="mt-1" {...register("email")} />
                      {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">{t("subject")}</Label>
                    <Input id="subject" className="mt-1" {...register("subject")} />
                    {errors.subject && <p className="mt-1 text-sm text-destructive">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="message">{t("message")}</Label>
                    <textarea
                      id="message"
                      rows={5}
                      className="mt-1 flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register("message")}
                    />
                    {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? tc("loading") : t("sendMessage")}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
