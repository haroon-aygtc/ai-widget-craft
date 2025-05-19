
import React from 'react';
import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { modelFormSchema, ModelFormValues } from '@/types/models';
import { BrowserRouter } from 'react-router-dom';

// Wrapper with form provider for testing form components
export const FormProviderWrapper = ({ children, defaultValues }: { children: React.ReactNode; defaultValues?: Partial<ModelFormValues> }) => {
  const methods = useForm<ModelFormValues>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: '',
      provider: '',
      modelId: '',
      apiKey: '',
      baseUrl: '',
      active: true,
      type: 'text',
      temperature: 0.7,
      maxTokens: 1024,
      ...defaultValues
    },
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

// Wrapper with router for testing components that use router hooks
export const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

// Custom render with providers
export function renderWithProviders(
  ui: React.ReactElement,
  { 
    formValues = {}, 
    withRouter = false,
    ...renderOptions 
  }: { 
    formValues?: Partial<ModelFormValues>; 
    withRouter?: boolean;
    [key: string]: any;
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    let wrapped = children;
    
    if (withRouter) {
      wrapped = <RouterWrapper>{wrapped}</RouterWrapper>;
    }
    
    return <FormProviderWrapper defaultValues={formValues}>{wrapped}</FormProviderWrapper>;
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
