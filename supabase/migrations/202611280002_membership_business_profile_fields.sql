-- The updated membership profile collects business name/category, operating state,
-- and country of residence instead of occupation and residential address details.
-- Preserve all historical values while allowing those legacy fields to be omitted.
alter table public.membership_applications
  alter column occupation drop not null,
  alter column residential_address drop not null,
  alter column local_government drop not null,
  alter column town_city drop not null;
