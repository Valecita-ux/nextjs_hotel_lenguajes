// src/app/api/operador/consultas/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Función de Simulación de API Web Externa (Traducción)
// Esto cumple con el requisito de usar una segunda API Web
async function traducirTexto(texto: string, idiomaDestino: string = 'en') {
    // Simulación de latencia de una API externa
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const traducciones: { [key: string]: string } = {
        'es': 'Simulación: Esta consulta está en español.',
        'en': 'Simulation: This query is in English.',
        'fr': 'Simulation: Cette requête est en français.',
    };

    const idiomaOriginal = texto.length > 50 && texto.includes('?') ? 'en' : 'es'; // Detección simple
    
    // Si ya está en el idioma destino o si el texto es muy corto, solo se devuelve.
    if (idiomaOriginal === idiomaDestino || texto.length < 10) {
        return { 
            textoTraducido: texto, 
            idiomaDetectado: idiomaOriginal 
        };
    }

    // Usamos el texto de la simulación
    const textoTraducido = traducciones[idiomaDestino] || `[Traducción simulada a ${idiomaDestino}: ${texto.substring(0, 30)}...]`;

    return { 
        textoTraducido, 
        idiomaDetectado: idiomaOriginal 
    };
}


// GET: Obtener consultas y, opcionalmente, traducir una en específico
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idConsulta = searchParams.get('id');
    const traducir = searchParams.get('traducir');
    
    try {
        if (idConsulta && traducir) {
            // Caso 1: Uso de la SEGUNDA API WEB (Traducción)
            const consulta = await prisma.consulta.findUnique({
                where: { id_consulta: parseInt(idConsulta) },
            });

            if (!consulta) {
                return NextResponse.json({ success: false, message: 'Consulta no encontrada.' }, { status: 404 });
            }

            const resultadoTraduccion = await traducirTexto(consulta.mensaje, 'en'); 

            return NextResponse.json({ 
                success: true, 
                traduccion: resultadoTraduccion.textoTraducido,
                idioma: resultadoTraduccion.idiomaDetectado
            }, { status: 200 });
        }

        // Caso 2: Listar todas las consultas (por defecto, no respondidas)
        const whereClause = { estado: 'pendiente' };
        
        const consultas = await prisma.consulta.findMany({
            where: whereClause,
            orderBy: {
                fecha_consulta: 'asc',
            },
        });

        return NextResponse.json({ success: true, consultas }, { status: 200 });

    } catch (error) {
        console.error('Error al consultar o traducir:', error);
        return NextResponse.json({ success: false, message: 'Error interno del servidor.' }, { status: 500 });
    }
}


// PATCH: Marcar consulta como respondida
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id_consulta, respuesta } = body;

        if (!id_consulta || !respuesta) {
            return NextResponse.json({ success: false, message: 'ID de consulta y respuesta son requeridos.' }, { status: 400 });
        }
        
        const consultaActualizada = await prisma.consulta.update({
            where: { id_consulta: parseInt(id_consulta) },
            data: { 
                estado: 'respondida', 
                respuesta: respuesta,
                fecha_respuesta: new Date(),
            },
        });

        return NextResponse.json({ 
            success: true, 
            message: `Consulta #${id_consulta} marcada como respondida.`,
            consulta: consultaActualizada
        }, { status: 200 });

    } catch (error) {
        console.error('Error al actualizar consulta:', error);
        return NextResponse.json({ success: false, message: 'Error al responder la consulta.' }, { status: 500 });
    }
}