CREATE TABLE public.card_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number text NOT NULL UNIQUE,
  firebase_uid text NOT NULL,
  email text NOT NULL,
  nombre_completo text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX card_claims_firebase_uid_idx ON public.card_claims (firebase_uid);

GRANT ALL ON public.card_claims TO service_role;

ALTER TABLE public.card_claims ENABLE ROW LEVEL SECURITY;