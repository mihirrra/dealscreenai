from db.supabase import supabase
from services.rag import embed_property
import asyncio

async def embed_all():
    properties = supabase.table('properties').select('*').execute()
    for prop in properties.data:
        await embed_property(prop)
        print(f"Embedded: {prop['location']}")
    print('All done!')

asyncio.run(embed_all())