Add a new IT service to Nexvora.

Steps:
1. **Via Admin Panel** (recommended): Go to http://localhost:3000/admin/services → click "Add Service"
   - Fill in: title, description, icon name (Lucide), features, price, order
   - Publish when ready

2. **Via Seed** (for initial data): Edit `prisma/seed.ts`, add to the services array:
```ts
{
  title: 'Service Name',
  description: 'Service description',
  icon: 'LucideIconName',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  price: '$X,XXX',
  order: 7,
  published: true,
}
```
Then run: `npm run db:seed`

3. **Add translations**: Update `messages/fr.json`, `en.json`, `es.json` under `services.items.serviceKey`

Icons available: Globe, Smartphone, GitBranch, Brain, Zap, Shield, Database, Cloud, Code, Cpu
